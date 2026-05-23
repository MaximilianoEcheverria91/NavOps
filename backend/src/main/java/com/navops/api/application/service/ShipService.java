package com.navops.api.application.service;

import com.navops.api.application.dto.request.ship.ShipCreateRequest;
import com.navops.api.application.dto.request.ship.ShipUpdateRequest;
import com.navops.api.application.dto.response.ship.ShipDetailResponse;
import com.navops.api.application.dto.response.ship.ShipSummaryResponse;
import com.navops.api.domain.entity.Country;
import com.navops.api.domain.entity.Engine;
import com.navops.api.domain.entity.Maintenance;
import com.navops.api.domain.entity.Ship;
import com.navops.api.domain.entity.ShipTank;
import com.navops.api.domain.enums.ShipStatusEnum;
import com.navops.api.domain.enums.ShipTypeEnum;
import com.navops.api.infrastructure.exception.NoShipsFoundException;
import com.navops.api.infrastructure.exception.ShipAlreadyExistsException;
import com.navops.api.infrastructure.exception.ShipNotFoundException;
import com.navops.api.repository.CountryRepository;
import com.navops.api.repository.EngineRepository;
import com.navops.api.repository.MaintenanceRepository;
import com.navops.api.repository.ShipRepository;
import com.navops.api.repository.ShipTankRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShipService {

    private final ShipRepository shipRepository;
    private final EngineRepository engineRepository;
    private final ShipTankRepository shipTankRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final CountryRepository countryRepository;
    private final ImageStorageService imageStorageService;

    @Transactional
    public ShipDetailResponse createShip(ShipCreateRequest request, MultipartFile image) throws IOException {
        log.info("Iniciando creación de barco con IMO: {}", request.imoNumber());

        if (shipRepository.existsByImoNumberAndDeletedAtIsNull(request.imoNumber())) {
            throw new ShipAlreadyExistsException("El número IMO ya se encuentra registrado.");
        }
        if (shipRepository.existsByRegistrationAndDeletedAtIsNull(request.registration())) {
            throw new ShipAlreadyExistsException("La matrícula ya se encuentra registrada.");
        }

        Country country = countryRepository.findById(request.countryId())
                .orElseThrow(() -> new IllegalArgumentException("El ID del país provisto no existe."));

        String mainImageUrl = null;
        if (image != null && !image.isEmpty()) {
            mainImageUrl = imageStorageService.uploadImage(image, "ships");
        }

        Ship ship = Ship.builder()
                .name(request.name())
                .imoNumber(request.imoNumber())
                .registration(request.registration())
                .shipType(ShipTypeEnum.valueOf(request.shipType().toUpperCase()))
                .buildYear(request.buildYear())
                .country(country)
                .status(ShipStatusEnum.valueOf(request.status()))
                .hullNumber(request.hullNumber())
                .holdCount(request.holdCount())
                .length(request.length())
                .beam(request.beam())
                .draft(request.draft())
                .depth(request.depth())
                .weightTonnes(request.weightTonnes())
                .cargoCapacityTonnes(request.cargoCapacityTonnes())
                .crewCapacity(request.crewCapacity())
                .mainImageUrl(mainImageUrl)
                .build();
        ship = shipRepository.save(ship);
        log.info("Barco registrado con ID: {}", ship.getId());

        Engine engine = null;
        if (request.engineManufacturer() != null && !request.engineManufacturer().isBlank()
                && request.engineModel() != null && !request.engineModel().isBlank()) {
            engine = Engine.builder()
                    .shipId(ship.getId())
                    .manufacturer(request.engineManufacturer())
                    .model(request.engineModel())
                    .serialNumber(request.serialNumber())
                    .currentEngineHours(request.currentEngineHours() != null ? request.currentEngineHours() : 0)
                    .lastTboEngineHours(request.lastTboEngineHours())
                    .build();
            engineRepository.save(engine);
        }

        if (request.fuelCapacityLiters() != null && request.fuelCapacityLiters().compareTo(BigDecimal.ZERO) > 0) {
            ShipTank tank = ShipTank.builder()
                    .shipId(ship.getId())
                    .contentType("FUEL")
                    .maxCapacityLiters(request.fuelCapacityLiters())
                    .build();
            shipTankRepository.save(tank);
        }

        if (request.lastMaintenanceDate() != null) {
            Maintenance maintenance = Maintenance.builder()
                    .shipId(ship.getId())
                    .status("COMPLETED")
                    .scheduledDate(request.lastMaintenanceDate())
                    .completedDate(request.lastMaintenanceDate())
                    .build();
            maintenanceRepository.save(maintenance);
        }

        return toDetailResponse(ship, engine, null, null);
    }

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
                        ship.getStatus().name()
                ))
                .toList();
    }

    @Transactional
    public ShipDetailResponse updateShip(UUID id, ShipUpdateRequest request, MultipartFile image) throws IOException {
        log.info("Actualizando barco con ID: {}", id);

        Ship ship = shipRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ShipNotFoundException("Barco no encontrado con id: " + id));

        if (!ship.getImoNumber().equals(request.imoNumber())
                && shipRepository.existsByImoNumberAndIdNotAndDeletedAtIsNull(request.imoNumber(), id)) {
            throw new ShipAlreadyExistsException("El número IMO ya se encuentra registrado por otro barco.");
        }
        if (!ship.getRegistration().equals(request.registration())
                && shipRepository.existsByRegistrationAndIdNotAndDeletedAtIsNull(request.registration(), id)) {
            throw new ShipAlreadyExistsException("La matrícula ya se encuentra registrada por otro barco.");
        }

        Country country = countryRepository.findById(request.countryId())
                .orElseThrow(() -> new IllegalArgumentException("El ID del país provisto no existe."));

        if (image != null && !image.isEmpty()) {
            String imageUrl = imageStorageService.uploadImage(image, "ships");
            ship.setMainImageUrl(imageUrl);
        }

        ship.setName(request.name());
        ship.setImoNumber(request.imoNumber());
        ship.setRegistration(request.registration());
        ship.setShipType(ShipTypeEnum.valueOf(request.shipType().toUpperCase()));
        ship.setBuildYear(request.buildYear());
        ship.setCountry(country);
        ship.setStatus(ShipStatusEnum.valueOf(request.status().toUpperCase()));
        ship.setHullNumber(request.hullNumber());
        ship.setHoldCount(request.holdCount());
        ship.setLength(request.length());
        ship.setBeam(request.beam());
        ship.setDraft(request.draft());
        ship.setDepth(request.depth());
        ship.setWeightTonnes(request.weightTonnes());
        ship.setCargoCapacityTonnes(request.cargoCapacityTonnes());
        ship.setCrewCapacity(request.crewCapacity());

        Engine engine = engineRepository.findFirstByShipIdAndDeletedAtIsNull(id).orElse(null);
        boolean hasEngineFields = request.engineManufacturer() != null && !request.engineManufacturer().isBlank()
                && request.engineModel() != null && !request.engineModel().isBlank();

        if (hasEngineFields) {
            if (engine != null) {
                engine.setManufacturer(request.engineManufacturer());
                engine.setModel(request.engineModel());
                if (request.engineType() != null) engine.setEngineType(request.engineType());
                if (request.powerHp() != null) engine.setPowerHp(request.powerHp());
                if (request.serialNumber() != null) engine.setSerialNumber(request.serialNumber());
                if (request.lastTboEngineHours() != null) engine.setLastTboEngineHours(request.lastTboEngineHours());
                engineRepository.save(engine);
            } else {
                engine = Engine.builder()
                        .shipId(ship.getId())
                        .manufacturer(request.engineManufacturer())
                        .model(request.engineModel())
                        .engineType(request.engineType() != null ? request.engineType() : "UNKNOWN")
                        .powerHp(request.powerHp() != null ? request.powerHp() : 0)
                        .serialNumber(request.serialNumber())
                        .currentEngineHours(0)
                        .lastTboEngineHours(request.lastTboEngineHours())
                        .build();
                engineRepository.save(engine);
            }
        }

        if (request.fuelCapacityLiters() != null) {
            List<ShipTank> tanks = shipTankRepository.findAllByShipIdAndDeletedAtIsNull(id);
            ShipTank tank = tanks.isEmpty() ? null : tanks.get(0);

            if (tank != null) {
                if (request.tankName() != null) tank.setTankName(request.tankName());
                if (request.contentType() != null) tank.setContentType(request.contentType());
                tank.setMaxCapacityLiters(request.fuelCapacityLiters());
                shipTankRepository.save(tank);
            } else {
                tank = ShipTank.builder()
                        .shipId(ship.getId())
                        .tankName(request.tankName() != null ? request.tankName() : "PRINCIPAL")
                        .contentType(request.contentType() != null ? request.contentType() : "FUEL")
                        .maxCapacityLiters(request.fuelCapacityLiters())
                        .build();
                shipTankRepository.save(tank);
            }
        }

        List<ShipTank> fuelTanks = shipTankRepository
                .findAllByShipIdAndContentTypeAndDeletedAtIsNull(id, request.contentType() != null ? request.contentType() : "FUEL");
        BigDecimal fuelTotal = fuelTanks.stream()
                .map(ShipTank::getMaxCapacityLiters)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal fuelCapacity = fuelTotal.compareTo(BigDecimal.ZERO) == 0 ? null : fuelTotal;

        List<Maintenance> maintenanceList = maintenanceRepository
                .findAllByShipIdAndDeletedAtIsNull(id);
        LocalDate lastMaintDate = maintenanceList.stream()
                .filter(m -> "COMPLETED".equals(m.getStatus()))
                .map(Maintenance::getCompletedDate)
                .filter(Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElse(null);

        log.info("Barco con ID {} actualizado exitosamente.", id);
        return toDetailResponse(ship, engine, fuelCapacity, lastMaintDate);
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

        return toDetailResponse(ship, engine, fuelCapacity, lastMaintDate);
    }

    @Transactional
    public void deactivateShip(UUID id) {
        log.info("Desactivando barco con ID: {}", id);

        Ship ship = shipRepository.findById(id)
                .orElseThrow(() -> new ShipNotFoundException("No se encontró el barco con el ID proporcionado."));

        ship.setStatus(ShipStatusEnum.INACTIVE);
        ship.setActive(false);
        ship.setDeletedAt(OffsetDateTime.now());

        log.info("Barco con ID {} desactivado exitosamente.", id);
    }

    @Transactional
    public void reactivateShip(UUID id) {
        log.info("Reactivando barco con ID: {}", id);

        Ship ship = shipRepository.findById(id)
                .orElseThrow(() -> new ShipNotFoundException("No se encontró el barco con el ID proporcionado."));

        ship.setStatus(ShipStatusEnum.OPERATIONAL);
        ship.setActive(true);
        ship.setDeletedAt(null);

        log.info("Barco con ID {} reactivado exitosamente.", id);
    }

    private ShipDetailResponse toDetailResponse(Ship ship, Engine engine, BigDecimal fuelCapacity, LocalDate lastMaintDate) {
        String countryName = ship.getCountry() != null ? ship.getCountry().getName() : null;
        return new ShipDetailResponse(
                ship.getId(),
                ship.getName(),
                ship.getRegistration(),
                ship.getImoNumber(),
                ship.getShipType().name(),
                (int) ship.getBuildYear(),
                countryName,
                ship.getStatus().name(),
                ship.getMainImageUrl(),
                ship.getHullNumber(),
                ship.getHoldCount(),
                ship.getLength(),
                ship.getBeam(),
                ship.getDraft(),
                ship.getDepth(),
                ship.getCrewCapacity(),
                ship.getWeightTonnes(),
                ship.getCargoCapacityTonnes(),
                engine != null ? engine.getManufacturer() : null,
                engine != null ? engine.getModel() : null,
                engine != null ? engine.getSerialNumber() : null,
                engine != null ? engine.getCurrentEngineHours() : null,
                engine != null ? engine.getLastTboEngineHours() : null,
                fuelCapacity,
                lastMaintDate
        );
    }
}
