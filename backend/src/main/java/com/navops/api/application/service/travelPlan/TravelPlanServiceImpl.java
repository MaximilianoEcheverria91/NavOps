package com.navops.api.application.service.travelPlan;

import com.navops.api.application.dto.request.travelPlan.CargoItemRequestDTO;
import com.navops.api.application.dto.request.travelPlan.StopRequestDTO;
import com.navops.api.application.dto.request.travelPlan.TravelPlanFilterRequest;
import com.navops.api.application.dto.request.travelPlan.TravelPlanRequestDTO;
import com.navops.api.application.dto.response.travelPlan.StopResponseDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanMetricsDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanResponseDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanSummaryResponseDTO;
import com.navops.api.application.dto.response.travelPlanCargo.TravelPlanCargoResponseDTO;
import com.navops.api.domain.entity.*;
import com.navops.api.domain.enums.CrewMemberStatusEnum;
import com.navops.api.domain.enums.ShipStatusEnum;
import com.navops.api.domain.enums.TravelPlanStatusEnum;
import com.navops.api.domain.enums.travelPlanCargo.CargoStatusEnum;
import com.navops.api.domain.enums.travelPlanCargo.CargoTypeEnum;
import com.navops.api.domain.enums.travelPlanCargo.ContainerTypeEnum;
import com.navops.api.domain.enums.travelPlanCargo.ProductCategoryEnum;
import com.navops.api.domain.specification.TravelPlanSpecification;
import com.navops.api.infrastructure.exception.BadRequestException;
import com.navops.api.infrastructure.exception.ResourceNotFoundException;
import com.navops.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TravelPlanServiceImpl implements TravelPlanService {

    private final TravelPlanRepository travelPlanRepository;
    private final ShipRepository shipRepository;
    private final PortRepository portRepository;
    private final CrewMemberRepository crewMemberRepository;
    private final ShipTankRepository shipTankRepository;
    private final TankReadingRepository tankReadingRepository;
    private final jakarta.persistence.EntityManager entityManager;


    @Override
    @Transactional(rollbackFor = Exception.class)
    public TravelPlanResponseDTO createTravelPlan(TravelPlanRequestDTO dto) {
        log.info("Iniciando creación de plan de travesía para buque ID: {}", dto.shipId());

        Ship ship = shipRepository.findByIdAndDeletedAtIsNull(dto.shipId())
                .orElseThrow(() -> new ResourceNotFoundException("Buque no encontrado con ID: " + dto.shipId()));

        // 1. Validar estado del buque
        if (ship.getStatus() != ShipStatusEnum.OPERATIONAL) {
            throw new BadRequestException(
                    "El buque no se encuentra en estado OPERATIONAL. Estado actual: " + ship.getStatus());
        }

        // 2. Validar solapamiento de fechas
        boolean overlapping = travelPlanRepository.existsOverlappingPlan(
                dto.shipId(), dto.departureTime(), dto.eta());
        if (overlapping) {
            throw new BadRequestException(
                    "El buque ya tiene un plan de travesía activo en el rango de fechas solicitado.");
        }

        // 3. Validar puertos
        if (dto.originPortId().equals(dto.destinationPortId())) {
            throw new BadRequestException("El puerto de origen y destino deben ser diferentes.");
        }

        Port originPort = portRepository.findByIdAndDeletedAtIsNull(dto.originPortId())
                .orElseThrow(() -> new ResourceNotFoundException("Puerto de origen no encontrado con ID: " + dto.originPortId()));
        Port destinationPort = portRepository.findByIdAndDeletedAtIsNull(dto.destinationPortId())
                .orElseThrow(() -> new ResourceNotFoundException("Puerto de destino no encontrado con ID: " + dto.destinationPortId()));

        // 4. Validar secuencia cronológica de las escalas
        validateStopChronology(dto);

        // 🚀 5. Validar capacidad de carga (Criterio Logístico Real: Cantidad * Peso Unitario)
        BigDecimal totalCargoWeight = BigDecimal.ZERO;
        if (dto.cargoItems() != null && !dto.cargoItems().isEmpty()) {
            totalCargoWeight = dto.cargoItems().stream()
                    .filter(Objects::nonNull)
                    .map(item -> {
                        BigDecimal cantidad = BigDecimal.valueOf(item.quantity() != null ? item.quantity() : 1);
                        BigDecimal pesoUnitario = item.weightTonnes() != null ? item.weightTonnes() : BigDecimal.ZERO;
                        // Multiplica la cantidad por el peso de cada fila
                        return pesoUnitario.multiply(cantidad);
                    })
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        if (totalCargoWeight.compareTo(ship.getCargoCapacityTonnes()) > 0) {
            throw new BadRequestException(
                    "La carga total real calculada (" + totalCargoWeight + " t) excede la capacidad máxima del buque ("
                            + ship.getCargoCapacityTonnes() + " t).");
        }
        // 7. Construir entidad raíz TravelPlan
        TravelPlan travelPlan = TravelPlan.builder()
                .ship(ship)
                .originPort(originPort)
                .destinationPort(destinationPort)
                .departureTime(dto.departureTime())
                .eta(dto.eta())
                .distanceMiles(dto.distanceMiles())
                .estimatedHours(dto.estimatedHours())
                .totalCargoTonnes(totalCargoWeight)
                .build();

        // 8. Mapear escalas (stops)
        if (dto.stops() != null) {
            for (StopRequestDTO stopDto : dto.stops()) {
                Port stopPort = portRepository.findByIdAndDeletedAtIsNull(stopDto.portId())
                        .orElseThrow(() -> new ResourceNotFoundException("Puerto de escala no encontrado con ID: " + stopDto.portId()));
                Stop stop = Stop.builder()
                        .travelPlan(travelPlan)
                        .port(stopPort)
                        .sequence(stopDto.sequence())
                        .estBoardingTime(stopDto.estBoardingTime())
                        .estDisembarkTime(stopDto.estDisembarkTime())
                        .build();
                travelPlan.getStops().add(stop);
            }
        }

        // 9. Mapear tripulación y validar disponibilidad
        if (dto.crewIds() != null) {
            for (UUID crewId : dto.crewIds()) {
                CrewMember crewMember = crewMemberRepository.findByIdAndDeletedAtIsNull(crewId)
                        .orElseThrow(() -> new ResourceNotFoundException("Tripulante no encontrado con ID: " + crewId));

                if (crewMember.getStatus() != CrewMemberStatusEnum.AVAILABLE) {
                    throw new BadRequestException(
                            "El tripulante " + crewMember.getPerson().getFullName()
                                    + " no está disponible. Estado actual: " + crewMember.getStatus());
                }

                TravelPlanCrew tpCrew = TravelPlanCrew.builder()
                        .travelPlan(travelPlan)
                        .crewMember(crewMember)
                        .role(crewMember.getNavigationRole().name())
                        .build();
                travelPlan.getCrewMembers().add(tpCrew);
            }
        }

        // 10. Mapear carga
        if (dto.cargoItems() != null) {
            for (CargoItemRequestDTO cargoDto : dto.cargoItems()) {
                TravelPlanCargo cargo = buildCargoEntity(travelPlan, cargoDto);
                travelPlan.getCargoItems().add(cargo);
            }
        }

        // 11. Persistir en cascada
        TravelPlan saved = travelPlanRepository.save(travelPlan);
        log.info("Plan de travesía creado exitosamente con ID: {}", saved.getId());

        return buildResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public TravelPlanMetricsDTO getMetrics() {
        log.info("Recuperando métricas de planes de travesía");
        Long scheduledCount = travelPlanRepository.countByStatusAndDeletedAtIsNull(TravelPlanStatusEnum.PLANNED);
        Long totalCompletedCount = travelPlanRepository.countByStatusAndDeletedAtIsNull(TravelPlanStatusEnum.COMPLETED);
        return new TravelPlanMetricsDTO(scheduledCount, totalCompletedCount);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TravelPlanSummaryResponseDTO> getActiveTravelPlans() {
        log.info("Recuperando planes de travesía activos");
        List<TravelPlanStatusEnum> excluded = List.of(
                TravelPlanStatusEnum.COMPLETED,
                TravelPlanStatusEnum.CANCELLED);
        List<TravelPlan> plans = travelPlanRepository.findActiveTravelPlans(excluded);
        return plans.stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TravelPlanSummaryResponseDTO> getFilteredTravelPlans(TravelPlanFilterRequest filter, Pageable pageable) {
        log.info("Ejecutando búsqueda filtrada de planes de travesía con criterios: {}", filter);
        Specification<TravelPlan> spec = TravelPlanSpecification.buildSpecification(filter);
        Page<TravelPlan> page = travelPlanRepository.findAll(spec, pageable);
        return page.map(this::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public TravelPlanResponseDTO getTravelPlanById(UUID id) {
        log.info("Recuperando plan de travesía por ID: {}", id);
        TravelPlan travelPlan = travelPlanRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan de travesía no encontrado con ID: " + id));
        return buildResponse(travelPlan);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public TravelPlanResponseDTO updateTravelPlan(UUID id, TravelPlanRequestDTO dto) {
        log.info("Iniciando actualización de plan de travesía ID: {}", id);

        TravelPlan travelPlan = travelPlanRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan de travesía no encontrado con ID: " + id));

        // 1. Validar que el plan no esté COMPLETED ni CANCELLED
        if (travelPlan.getStatus() == TravelPlanStatusEnum.COMPLETED
                || travelPlan.getStatus() == TravelPlanStatusEnum.CANCELLED) {
            throw new BadRequestException(
                    "No se puede actualizar un plan de travesía en estado " + travelPlan.getStatus());
        }

        // 2. Validar buque
        Ship ship = shipRepository.findByIdAndDeletedAtIsNull(dto.shipId())
                .orElseThrow(() -> new ResourceNotFoundException("Buque no encontrado con ID: " + dto.shipId()));

        if (ship.getStatus() != ShipStatusEnum.OPERATIONAL) {
            throw new BadRequestException(
                    "El buque no se encuentra en estado OPERATIONAL. Estado actual: " + ship.getStatus());
        }

        // 3. Validar solapamiento de fechas (excluyendo el plan actual)
        boolean shipChanged = !travelPlan.getShip().getId().equals(dto.shipId());
        boolean datesChanged = !travelPlan.getDepartureTime().equals(dto.departureTime())
                || !travelPlan.getEta().equals(dto.eta());

        if (shipChanged || datesChanged) {
            boolean overlapping = travelPlanRepository.existsOverlappingPlanExcludingId(
                    dto.shipId(), id, dto.departureTime(), dto.eta());
            if (overlapping) {
                throw new BadRequestException(
                        "El buque ya tiene un plan de travesía activo en el rango de fechas solicitado.");
            }
        }

        // 4. Validar puertos
        if (dto.originPortId().equals(dto.destinationPortId())) {
            throw new BadRequestException("El puerto de origen y destino deben ser diferentes.");
        }

        Port originPort = portRepository.findByIdAndDeletedAtIsNull(dto.originPortId())
                .orElseThrow(() -> new ResourceNotFoundException("Puerto de origen no encontrado con ID: " + dto.originPortId()));
        Port destinationPort = portRepository.findByIdAndDeletedAtIsNull(dto.destinationPortId())
                .orElseThrow(() -> new ResourceNotFoundException("Puerto de destino no encontrado con ID: " + dto.destinationPortId()));

        // 5. Validar secuencia cronológica de las escalas
        validateStopChronology(dto);

        // 6. Validar capacidad de carga
        BigDecimal totalCargoWeight = BigDecimal.ZERO;
        if (dto.cargoItems() != null && !dto.cargoItems().isEmpty()) {
            totalCargoWeight = dto.cargoItems().stream()
                    .filter(Objects::nonNull)
                    .map(item -> {
                        BigDecimal cantidad = BigDecimal.valueOf(item.quantity() != null ? item.quantity() : 1);
                        BigDecimal pesoUnitario = item.weightTonnes() != null ? item.weightTonnes() : BigDecimal.ZERO;
                        return pesoUnitario.multiply(cantidad);
                    })
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        if (totalCargoWeight.compareTo(ship.getCargoCapacityTonnes()) > 0) {
            throw new BadRequestException(
                    "La carga total real calculada (" + totalCargoWeight + " t) excede la capacidad máxima del buque ("
                            + ship.getCargoCapacityTonnes() + " t).");
        }

        // 7. Actualizar campos escalares de TravelPlan
        travelPlan.setShip(ship);
        travelPlan.setOriginPort(originPort);
        travelPlan.setDestinationPort(destinationPort);
        travelPlan.setDepartureTime(dto.departureTime());
        travelPlan.setEta(dto.eta());
        travelPlan.setDistanceMiles(dto.distanceMiles());
        travelPlan.setEstimatedHours(dto.estimatedHours());
        travelPlan.setTotalCargoTonnes(totalCargoWeight);

        // 8. Reemplazar stops (orphanRemoval elimina los anteriores)
        travelPlan.getStops().clear();
        travelPlan.getCrewMembers().clear(); // 🚀 Movemos las limpiezas juntas aquí
        travelPlan.getCargoItems().clear();   // 🚀 Movemos las limpiezas juntas aquí

        // 🔥 LA MAGIA SENIOR: Obliga a Hibernate a ejecutar los DELETE en Postgres AHORA MISMO
        entityManager.flush();

        if (dto.stops() != null) {
            for (StopRequestDTO stopDto : dto.stops()) {
                Port stopPort = portRepository.findByIdAndDeletedAtIsNull(stopDto.portId())
                        .orElseThrow(() -> new ResourceNotFoundException("Puerto de escala no encontrado con ID: " + stopDto.portId()));
                Stop stop = Stop.builder()
                        .travelPlan(travelPlan)
                        .port(stopPort)
                        .sequence(stopDto.sequence())
                        .estBoardingTime(stopDto.estBoardingTime())
                        .estDisembarkTime(stopDto.estDisembarkTime())
                        .build();
                travelPlan.getStops().add(stop);
            }
        }

        // 9. Reemplazar tripulación (orphanRemoval elimina los anteriores)
        if (dto.crewIds() != null) {
            for (UUID crewId : dto.crewIds()) {
                CrewMember crewMember = crewMemberRepository.findByIdAndDeletedAtIsNull(crewId)
                        .orElseThrow(() -> new ResourceNotFoundException("Tripulante no encontrado con ID: " + crewId));

                if (crewMember.getStatus() != CrewMemberStatusEnum.AVAILABLE) {
                    throw new BadRequestException(
                            "El tripulante " + crewMember.getPerson().getFullName()
                                    + " no está disponible. Estado actual: " + crewMember.getStatus());
                }

                TravelPlanCrew tpCrew = TravelPlanCrew.builder()
                        .travelPlan(travelPlan)
                        .crewMember(crewMember)
                        .role(crewMember.getNavigationRole().name())
                        .build();
                travelPlan.getCrewMembers().add(tpCrew);
            }
        }

        // 10. Reemplazar carga (orphanRemoval elimina los anteriores)
        if (dto.cargoItems() != null) {
            for (CargoItemRequestDTO cargoDto : dto.cargoItems()) {
                TravelPlanCargo cargo = buildCargoEntity(travelPlan, cargoDto);
                travelPlan.getCargoItems().add(cargo);
            }
        }

        // 11. Persistir
        TravelPlan saved = travelPlanRepository.save(travelPlan);
        log.info("Plan de travesía actualizado exitosamente con ID: {}", saved.getId());

        return buildResponse(saved);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public TravelPlanResponseDTO cancelTravelPlan(UUID id) {
        log.info("Iniciando cancelación de plan de travesía ID: {}", id);

        TravelPlan travelPlan = travelPlanRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan de travesía no encontrado con ID: " + id));

        if (travelPlan.getStatus() == TravelPlanStatusEnum.IN_PROGRESS
                || travelPlan.getStatus() == TravelPlanStatusEnum.COMPLETED
                || travelPlan.getStatus() == TravelPlanStatusEnum.CANCELLED) {
            throw new BadRequestException(
                    "No se puede cancelar un plan de travesía en estado " + travelPlan.getStatus());
        }

        travelPlan.setStatus(TravelPlanStatusEnum.CANCELLED);
        TravelPlan saved = travelPlanRepository.save(travelPlan);
        log.info("Plan de travesía cancelado exitosamente con ID: {}", saved.getId());

        return buildResponse(saved);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public TravelPlanResponseDTO startTravelPlan(UUID id) {
        log.info("Iniciando travesia en tiempo real para plan ID: {}", id);

        TravelPlan travelPlan = travelPlanRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan de travesia no encontrado con ID: " + id));

        if (travelPlan.getStatus() != TravelPlanStatusEnum.PLANNED) {
            throw new BadRequestException(
                    "Solo se puede iniciar un plan de travesia en estado PLANNED. Estado actual: " + travelPlan.getStatus());
        }

        travelPlan.setStatus(TravelPlanStatusEnum.IN_PROGRESS);

        travelPlan.setCurrentLatitude(BigDecimal.valueOf(travelPlan.getOriginPort().getLatitude()));
        travelPlan.setCurrentLongitude(BigDecimal.valueOf(travelPlan.getOriginPort().getLongitude()));
        travelPlan.setCurrentEngineStatus("OK");
        travelPlan.setCurrentHeading(0);

        List<ShipTank> tanks = shipTankRepository.findAllByShipIdAndDeletedAtIsNull(travelPlan.getShip().getId());
        for (ShipTank tank : tanks) {
            TankReading reading = TankReading.builder()
                    .tank(tank)
                    .travelPlan(travelPlan)
                    .currentVolumeLiters(tank.getMaxCapacityLiters())
                    .fillPercentage(new BigDecimal("100.00"))
                    .build();
            tankReadingRepository.save(reading);
        }

        TravelPlan saved = travelPlanRepository.save(travelPlan);
        log.info("Travesia iniciada exitosamente para plan ID: {}", saved.getId());

        return buildResponse(saved);
    }

    private TravelPlanSummaryResponseDTO toSummaryResponse(TravelPlan entity) {
        return new TravelPlanSummaryResponseDTO(
                entity.getId(),
                entity.getShip().getName(),
                entity.getShip().getMainImageUrl(),
                entity.getOriginPort().getName(),
                entity.getDestinationPort().getName(),
                entity.getDistanceMiles(),
                entity.getDepartureTime(),
                entity.getEta(),
                entity.getStatus().name(),
                entity.getStops().size()
        );
    }

    private void validateStopChronology(TravelPlanRequestDTO dto) {
        if (dto.stops() == null || dto.stops().isEmpty()) {
            return;
        }
        if (dto.departureTime() == null || dto.eta() == null) {
            return;
        }

        List<StopRequestDTO> sorted = dto.stops().stream()
                .sorted(Comparator.comparing(StopRequestDTO::sequence))
                .toList();

        OffsetDateTime previous = dto.departureTime();

        for (StopRequestDTO stop : sorted) {
            if (stop.estBoardingTime() != null) {
                if (!stop.estBoardingTime().isAfter(previous)) {
                    throw new BadRequestException(
                            "La fecha de embarque de la escala " + stop.sequence()
                                    + " debe ser posterior a " + previous);
                }
                previous = stop.estBoardingTime();
            }
            if (stop.estDisembarkTime() != null) {
                if (!stop.estDisembarkTime().isAfter(previous)) {
                    throw new BadRequestException(
                            "La fecha de desembarque de la escala " + stop.sequence()
                                    + " debe ser posterior a " + previous);
                }
                previous = stop.estDisembarkTime();
            }
        }

        if (!dto.eta().isAfter(previous)) {
            throw new BadRequestException(
                    "La fecha estimada de llegada (ETA) debe ser posterior a la última escala.");
        }
    }

    private TravelPlanCargo buildCargoEntity(TravelPlan travelPlan, CargoItemRequestDTO dto) {
        try {
            ContainerTypeEnum containerEnum = null;
            if (dto.containerType() != null && !dto.containerType().isBlank()) {
                try {
                    containerEnum = ContainerTypeEnum.valueOf(dto.containerType().toUpperCase());
                } catch (IllegalArgumentException e) {
                    // 💡 Si mandan "STANDARD" o cualquier string que no coincida,
                    // lo manejamos como null para que Postgres lo guarde como columna vacía (nullable).
                    containerEnum = null;
                }
            }
            return TravelPlanCargo.builder()
                    .travelPlan(travelPlan)
                    .productName(dto.productName())
                    .productCategory(ProductCategoryEnum.valueOf(dto.productCategory().toUpperCase()))
                    .productType(dto.productType())
                    .cargoType(CargoTypeEnum.valueOf(dto.cargoType().toUpperCase()))
                    .quantity(dto.quantity())
                    .weightTonnes(dto.weightTonnes())
                    .volumeM3(dto.volumeM3())
                    .owningCompany(dto.owningCompany())
                    .containerType(containerEnum)
                    .hazardousMaterial(dto.hazardousMaterial())
                    .description(dto.description())
                    .status(CargoStatusEnum.LOADED)
                    .build();
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Valor inválido en los campos enumerados de carga: " + e.getMessage());
        }
    }

    public TravelPlanResponseDTO buildResponse(TravelPlan entity) {
        List<StopResponseDTO> stopResponses = entity.getStops().stream()
                .map(s -> new StopResponseDTO(
                        s.getId(),
                        s.getPort().getId(),
                        s.getPort().getName(),
                        s.getPort().getLatitude(),
                        s.getPort().getLongitude(),
                        s.getSequence(),
                        s.getEstBoardingTime(),
                        s.getEstDisembarkTime()))
                .toList();

        List<TravelPlanCargoResponseDTO> cargoResponses = entity.getCargoItems().stream()
                .map(c -> new TravelPlanCargoResponseDTO(
                        c.getId(),
                        c.getTravelPlan().getId(),
                        c.getProductName(),
                        c.getProductCategory().name(),
                        c.getProductType(),
                        c.getCargoType().name(),
                        c.getQuantity(),
                        c.getWeightTonnes(),
                        c.getVolumeM3(),
                        c.getOwningCompany(),
                        c.getContainerType() != null ? c.getContainerType().name() : null,
                        c.isHazardousMaterial(),
                        c.getDescription(),
                        c.getStatus().name(),
                        c.getCreatedAt(),
                        c.getUpdatedAt()))
                .toList();

        List<UUID> crewMemberIds = entity.getCrewMembers().stream()
                .map(tpc -> tpc.getCrewMember().getId())
                .toList();

        return new TravelPlanResponseDTO(
                entity.getId(),
                entity.getShip().getId(),
                entity.getShip().getName(),
                entity.getOriginPort().getId(),
                entity.getOriginPort().getName(),
                entity.getDestinationPort().getId(),
                entity.getDestinationPort().getName(),
                entity.getOriginPort().getLatitude(),
                entity.getOriginPort().getLongitude(),
                entity.getDestinationPort().getLatitude(),
                entity.getDestinationPort().getLongitude(),
                entity.getDepartureTime(),
                entity.getEta(),
                entity.getDistanceMiles(),
                entity.getEstimatedHours(),
                entity.getShip().getCargoCapacityTonnes(),
                entity.getShip().getCrewCapacity(),
                entity.getShip().getRegistration(),
                entity.getShip().getShipType().name(),
                entity.getShip().getMainImageUrl(),
                entity.getStatus().name(),
                entity.getProgressPercentage(),
                entity.getTotalCargoTonnes(),
                crewMemberIds,
                stopResponses,
                cargoResponses,
                entity.getCreatedAt()
        );
    }
}
