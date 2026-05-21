package com.navops.api.application.service;

import com.navops.api.application.dto.request.navigation.NavigationPlanCreateRequest;
import com.navops.api.application.dto.response.navigation.*;
import com.navops.api.domain.entity.*;
import com.navops.api.domain.enums.NavigationPlanStatusEnum;
import com.navops.api.infrastructure.exception.NavigationPlanNotFoundException;
import com.navops.api.infrastructure.exception.PortNotFoundException;
import com.navops.api.infrastructure.exception.ShipNotFoundException;
import com.navops.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NavigationPlanService {

    private final NavigationPlanRepository navigationPlanRepository;
    private final NavigationRouteRepository navigationRouteRepository;
    private final ShipRepository shipRepository;
    private final PortRepository portRepository;

    @Transactional
    public NavigationPlanDetailResponse createPlan(NavigationPlanCreateRequest request) {
        log.info("Creando plan de navegación: {}", request.name());

        Ship ship = shipRepository.findByIdAndDeletedAtIsNull(request.shipId())
                .orElseThrow(() -> new ShipNotFoundException("Barco no encontrado con id: " + request.shipId()));

        NavigationRoute route = null;
        if (request.originPortId() != null || request.destinationPortId() != null) {
            Port origin = request.originPortId() != null
                    ? portRepository.findById(request.originPortId())
                        .orElseThrow(() -> new PortNotFoundException("Puerto de origen no encontrado."))
                    : null;
            Port destination = request.destinationPortId() != null
                    ? portRepository.findById(request.destinationPortId())
                        .orElseThrow(() -> new PortNotFoundException("Puerto de destino no encontrado."))
                    : null;

            route = NavigationRoute.builder()
                    .originPort(origin)
                    .destinationPort(destination)
                    .departureTime(request.departureTime())
                    .estimatedArrivalTime(request.estimatedArrivalTime())
                    .distanceNauticalMiles(request.distanceNauticalMiles())
                    .notes(request.notes())
                    .build();
            route = navigationRouteRepository.save(route);
        }

        NavigationPlan plan = NavigationPlan.builder()
                .name(request.name())
                .ship(ship)
                .route(route)
                .status(NavigationPlanStatusEnum.DRAFT)
                .notes(request.notes())
                .build();

        plan = navigationPlanRepository.save(plan);
        log.info("Plan de navegación creado con id: {}", plan.getId());
        return toDetailResponse(plan);
    }

    @Transactional(readOnly = true)
    public List<NavigationPlanSummaryResponse> getAll() {
        return navigationPlanRepository.findAllByDeletedAtIsNull()
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public NavigationPlanDetailResponse getById(UUID id) {
        NavigationPlan plan = navigationPlanRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new NavigationPlanNotFoundException("No se encontró el Plan de Travesía con id: " + id));
        return toDetailResponse(plan);
    }

    @Transactional
    public void deletePlan(UUID id) {
        NavigationPlan plan = navigationPlanRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new NavigationPlanNotFoundException("No se encontró el Plan de Travesía con id: " + id));
        plan.setDeletedAt(OffsetDateTime.now());
        navigationPlanRepository.save(plan);
    }

    private NavigationPlanDetailResponse toDetailResponse(NavigationPlan plan) {
        NavigationRouteResponse routeResponse = null;
        if (plan.getRoute() != null) {
            NavigationRoute r = plan.getRoute();
            routeResponse = new NavigationRouteResponse(
                    r.getId(),
                    r.getOriginPort() != null ? r.getOriginPort().getId() : null,
                    r.getOriginPort() != null ? r.getOriginPort().getName() : null,
                    r.getDestinationPort() != null ? r.getDestinationPort().getId() : null,
                    r.getDestinationPort() != null ? r.getDestinationPort().getName() : null,
                    r.getDepartureTime(),
                    r.getEstimatedArrivalTime(),
                    r.getDistanceNauticalMiles(),
                    r.getNotes()
            );
        }

        List<PlanCrewResponse> crewResponses = plan.getCrewAssignments().stream()
                .map(a -> new PlanCrewResponse(
                        a.getCrewMember().getId(),
                        a.getCrewMember().getPerson().getFullName() + " " + a.getCrewMember().getPerson().getSurname(),
                        a.getAssignedRole().name()
                ))
                .toList();

        List<NavigationCargoResponse> cargoResponses = plan.getCargoList().stream()
                .map(c -> new NavigationCargoResponse(
                        c.getId(),
                        c.getCargoType(),
                        c.getWeightTonnes(),
                        c.getDescription()
                ))
                .toList();

        return new NavigationPlanDetailResponse(
                plan.getId(),
                plan.getName(),
                plan.getStatus().name(),
                plan.getShip() != null ? plan.getShip().getId() : null,
                plan.getShip() != null ? plan.getShip().getName() : null,
                plan.getShip() != null ? plan.getShip().getRegistration() : null,
                plan.getShip() != null ? plan.getShip().getStatus().name() : null,
                routeResponse,
                crewResponses,
                crewResponses.size(),
                cargoResponses,
                plan.getNotes(),
                plan.getCreatedAt(),
                plan.getUpdatedAt()
        );
    }

    private NavigationPlanSummaryResponse toSummaryResponse(NavigationPlan plan) {
        NavigationRoute r = plan.getRoute();
        return new NavigationPlanSummaryResponse(
                plan.getId(),
                plan.getName(),
                plan.getStatus().name(),
                plan.getShip() != null ? plan.getShip().getName() : null,
                r != null && r.getOriginPort() != null ? r.getOriginPort().getName() : null,
                r != null && r.getDestinationPort() != null ? r.getDestinationPort().getName() : null,
                r != null ? r.getDepartureTime() : null,
                plan.getCreatedAt()
        );
    }
}
