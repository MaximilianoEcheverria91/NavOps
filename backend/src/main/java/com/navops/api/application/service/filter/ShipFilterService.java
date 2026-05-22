package com.navops.api.application.service.filter;

import com.navops.api.application.dto.request.ship.ShipFilterRequest;
import com.navops.api.application.dto.response.ship.ShipFilterResponse;
import com.navops.api.application.dto.response.ship.ShipSummaryResponse;
import com.navops.api.domain.entity.Ship;
import com.navops.api.domain.specification.ShipFilterSpecification;
import com.navops.api.repository.filters.ShipFilterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShipFilterService {

    private final ShipFilterRepository shipFilterRepository;

    @Transactional(readOnly = true)
    public ShipFilterResponse filterShips(ShipFilterRequest request) {
        log.info("Ejecutando filtros avanzados de barcos");

        validateRangeFilter(request.minBuildYear(), request.maxBuildYear(), "año de construcción");
        validateRangeFilter(request.minLength(), request.maxLength(), "eslora");
        validateRangeFilter(request.minBeam(), request.maxBeam(), "manga");
        validateRangeFilter(request.minDraft(), request.maxDraft(), "calado");
        validateRangeFilter(request.minDepth(), request.maxDepth(), "puntal");
        validateRangeFilter(request.minCargoCapacityTonnes(), request.maxCargoCapacityTonnes(), "capacidad de carga");
        validateRangeFilter(request.minCrewCapacity(), request.maxCrewCapacity(), "capacidad de tripulación");
        validateRangeFilter(request.minHoldCount(), request.maxHoldCount(), "cantidad de bodegas");
        validateRangeFilter(request.minMaxCapacityLiters(), request.maxMaxCapacityLiters(), "capacidad máxima en litros");

        Specification<Ship> spec = ShipFilterSpecification.build(
                request.shipTypes(),
                request.countryId(),
                request.statuses(),
                request.minBuildYear(),
                request.maxBuildYear(),
                request.minLength(),
                request.maxLength(),
                request.minBeam(),
                request.maxBeam(),
                request.minDraft(),
                request.maxDraft(),
                request.minDepth(),
                request.maxDepth(),
                request.minCargoCapacityTonnes(),
                request.maxCargoCapacityTonnes(),
                request.minCrewCapacity(),
                request.maxCrewCapacity(),
                request.minHoldCount(),
                request.maxHoldCount(),
                request.minMaxCapacityLiters(),
                request.maxMaxCapacityLiters()
        );

        Sort sort = ShipFilterSpecification.getSortDirection(request.sortBy(), request.sortDirection());
        PageRequest pageRequest = PageRequest.of(request.page(), request.size(), sort);

        Page<Ship> page = shipFilterRepository.findAll(spec, pageRequest);

        List<ShipSummaryResponse> content = page.getContent().stream()
                .map(this::mapToSummaryResponse)
                .collect(Collectors.toList());

        return new ShipFilterResponse(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast(),
                page.isFirst()
        );
    }

    private void validateRangeFilter(Number min, Number max, String fieldName) {
        if (min != null && max != null && max.doubleValue() <= min.doubleValue()) {
            throw new IllegalArgumentException(
                    "El valor máximo de " + fieldName + " debe ser mayor que el valor mínimo");
        }
    }

    private ShipSummaryResponse mapToSummaryResponse(Ship ship) {
        return new ShipSummaryResponse(
                ship.getId(),
                ship.getName(),
                ship.getRegistration(),
                ship.getImoNumber(),
                ship.getMainImageUrl(),
                ship.getStatus() != null ? ship.getStatus().name() : null
        );
    }
}
