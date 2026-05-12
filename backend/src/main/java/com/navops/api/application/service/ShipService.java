package com.navops.api.application.service;

import com.navops.api.application.dto.response.ship.ShipDetailResponse;
import com.navops.api.application.dto.response.ship.ShipSummaryResponse;
import com.navops.api.domain.entity.Engine;
import com.navops.api.domain.entity.Maintenance;
import com.navops.api.domain.entity.Ship;
import com.navops.api.domain.entity.ShipTank;
import com.navops.api.domain.enums.ShipStatusEnum;
import com.navops.api.infrastructure.exception.NoShipsFoundException;
import com.navops.api.infrastructure.exception.ShipNotFoundException;
import com.navops.api.repository.EngineRepository;
import com.navops.api.repository.MaintenanceRepository;
import com.navops.api.repository.ShipRepository;
import com.navops.api.repository.ShipTankRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShipService {

    private final ShipRepository shipRepository;
    private final EngineRepository engineRepository;
    private final ShipTankRepository shipTankRepository;
    private final MaintenanceRepository maintenanceRepository;

    @Transactional(readOnly = true)
    public List<ShipSummaryResponse> getAll() {
        log.info("Recuperando listado de barcos");
        List<Ship> ships = shipRepository.findAllByDeletedAtIsNull();
        if (ships.isEmpty()) {
            log.warn("No se encontraron barcos registrados.");
            throw new NoShipsFoundException("No se encontraron barcos registrados.");
        }

        List<UUID> shipIds = ships.stream().map(Ship::getId).toList();
        Map<UUID, List<Maintenance>> maintenanceByShip = maintenanceRepository
                .findAllByShipIdInAndDeletedAtIsNull(shipIds)
                .stream()
                .collect(Collectors.groupingBy(Maintenance::getShipId));

        return ships.stream()
                .map(ship -> new ShipSummaryResponse(
                        ship.getId(),
                        ship.getName(),
                        ship.getRegistration(),
                        ship.getImoNumber(),
                        ship.getMainImageUrl(),
                        deriveShipStatus(maintenanceByShip.getOrDefault(ship.getId(), List.of()))
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public ShipDetailResponse getById(UUID id) {
        log.info("Recuperando detalle de barco id: {}", id);
        Ship ship = shipRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ShipNotFoundException("Barco no encontrado con id: " + id));

        Engine engine = engineRepository.findFirstByShipIdAndDeletedAtIsNull(id).orElse(null);
        List<ShipTank> fuelTanks = shipTankRepository
                .findAllByShipIdAndContentTypeAndDeletedAtIsNull(id, "FUEL");
        List<Maintenance> maintenanceList = maintenanceRepository
                .findAllByShipIdAndDeletedAtIsNull(id);

        String countryName = ship.getCountry() != null ? ship.getCountry().getName() : null;

        BigDecimal fuelTotal = fuelTanks.stream()
                .map(ShipTank::getMaxCapacityLiters)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal fuelCapacity = fuelTotal.compareTo(BigDecimal.ZERO) == 0 ? null : fuelTotal;

        LocalDate lastMaintDate = maintenanceList.stream()
                .filter(m -> "COMPLETED".equals(m.getStatus()))
                .map(Maintenance::getCompletedDate)
                .filter(Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElse(null);

        return new ShipDetailResponse(
                ship.getId(),
                ship.getName(),
                ship.getRegistration(),
                ship.getImoNumber(),
                ship.getShipType(),
                (int) ship.getBuildYear(),
                countryName,
                deriveShipStatus(maintenanceList),
                ship.getMainImageUrl(),
                null, // hullNumber        — Gap 2: necesita ALTER TABLE ships ADD COLUMN hull_number VARCHAR(100)
                null, // holdCount         — Gap 3: necesita ALTER TABLE ships ADD COLUMN hold_count SMALLINT
                ship.getLength(),
                ship.getBeam(),
                ship.getDraft(),
                ship.getDepth(),
                ship.getCrewCapacity(),
                ship.getCargoCapacityTonnes(),
                engine != null ? engine.getModel() : null,
                null, // engineSerialNumber — Gap 4: necesita ALTER TABLE engines ADD COLUMN serial_number VARCHAR(100)
                engine != null ? engine.getCurrentEngineHours() : null,
                null, // lastTboEngineHours — Gap 5: necesita ALTER TABLE tbo ADD COLUMN last_tbo_engine_hours INT
                fuelCapacity,
                lastMaintDate
        );
    }

    // TEMPORAL — reemplazar por ship.getStatus() cuando exista ships.status (ver docs/ships-data-gaps.md Gap 1)
    // Para revertir: eliminar este método y cambiar la llamada en getAll() y getById() por ShipStatusEnum.OPERATIONAL.name()
    private static String deriveShipStatus(List<Maintenance> records) {
        boolean inProgress = records.stream()
                .anyMatch(m -> "IN_PROGRESS".equals(m.getStatus()));
        return inProgress ? ShipStatusEnum.MAINTENANCE.name() : ShipStatusEnum.OPERATIONAL.name();
    }
}