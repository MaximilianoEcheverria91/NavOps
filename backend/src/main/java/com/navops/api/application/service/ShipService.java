package com.navops.api.application.service;

import com.navops.api.application.dto.response.ship.ShipDetailResponse;
import com.navops.api.application.dto.response.ship.ShipSummaryResponse;
import com.navops.api.domain.entity.Ship;
import com.navops.api.domain.enums.ShipStatusEnum;
import com.navops.api.infrastructure.exception.NoShipsFoundException;
import com.navops.api.infrastructure.exception.ShipNotFoundException;
import com.navops.api.repository.ShipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShipService {

    private final ShipRepository shipRepository;

    @Transactional(readOnly = true)
    public List<ShipSummaryResponse> getAll() {
        log.info("Recuperando listado de barcos");
        List<Ship> ships = shipRepository.findAllByDeletedAtIsNull();
        if (ships.isEmpty()) {
            log.warn("No se encontraron barcos registrados.");
            throw new NoShipsFoundException("No se encontraron barcos registrados.");
        }
        return ships.stream()
                .map(ship -> new ShipSummaryResponse(
                        ship.getId(),
                        ship.getName(),
                        ship.getRegistration(),
                        ship.getImoNumber(),
                        ship.getMainImageUrl(),
                        ShipStatusEnum.OPERATIONAL.name()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public ShipDetailResponse getById(UUID id) {
        log.info("Recuperando detalle de barco id: {}", id);
        Ship ship = shipRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ShipNotFoundException("Barco no encontrado con id: " + id));

        String countryName = ship.getCountry() != null ? ship.getCountry().getName() : null;

        return new ShipDetailResponse(
                ship.getId(),
                ship.getName(),
                ship.getRegistration(),
                ship.getImoNumber(),
                ship.getShipType(),
                (int) ship.getBuildYear(),
                countryName,
                ShipStatusEnum.OPERATIONAL.name(),
                ship.getMainImageUrl(),
                null,  // hullNumber   — Gap 2
                null,  // holdCount    — Gap 3
                ship.getLength(),
                ship.getBeam(),
                ship.getDraft(),
                ship.getDepth(),
                ship.getCrewCapacity(),
                ship.getCargoCapacityTonnes(),
                null,  // engineModel        — requiere seed en engines?
                null,  // engineSerialNumber — Gap 4
                null,  // currentEngineHours — requiere seed en engines?
                null,  // lastTboEngineHours — Gap 5
                null,  // fuelCapacityLiters — requiere seed en ship_tanks?
                null   // lastMaintenanceDate — requiere seed en maintenance?
        );
    }
}
