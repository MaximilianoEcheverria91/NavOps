package com.navops.api.application.service.filter;

import com.navops.api.application.dto.request.port.PortFilterRequest;
import com.navops.api.application.dto.response.port.PortFilterResponse;
import com.navops.api.application.dto.response.port.PortSummaryResponse;
import com.navops.api.domain.entity.Port;
import com.navops.api.domain.specification.PortFilterSpecification;
import com.navops.api.repository.filters.PortFilterRepository;
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
public class PortFilterService {

    private final PortFilterRepository portFilterRepository;

    @Transactional(readOnly = true)
    public PortFilterResponse filterPorts(PortFilterRequest request) {
        log.info("Ejecutando filtros avanzados de puertos");

        validateRangeFilter(request.minDockCount(), request.maxDockCount(), "muelles");
        validateRangeFilter(request.minMaxLength(), request.maxMaxLength(), "eslora máxima");
        validateRangeFilter(request.minMaxDraft(), request.maxMaxDraft(), "calado máximo");

        Specification<Port> spec = PortFilterSpecification.build(
                request.countryId(),
                request.provinceId(),
                request.cityId(),
                request.portTypes(),
                request.dockTypes(),
                request.statuses(),
                request.minDockCount(),
                request.maxDockCount(),
                request.minMaxLength(),
                request.maxMaxLength(),
                request.minMaxDraft(),
                request.maxMaxDraft()
        );

        Sort sort = PortFilterSpecification.getSortDirection(request.sortBy(), request.sortDirection());
        PageRequest pageRequest = PageRequest.of(request.page(), request.size(), sort);

        Page<Port> page = portFilterRepository.findAll(spec, pageRequest);

        List<PortSummaryResponse> content = page.getContent().stream()
                .map(this::mapToSummaryResponse)
                .collect(Collectors.toList());

        return new PortFilterResponse(
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

    private PortSummaryResponse mapToSummaryResponse(Port port) {
        return new PortSummaryResponse(
                port.getId(),
                port.getMainImageUrl(),
                port.getName(),
                port.getCode(),
                port.getCountry() != null ? port.getCountry().getName() : null,
                port.getProvince() != null ? port.getProvince().getName() : null,
                port.getCity() != null ? port.getCity().getName() : null,
                port.getStatus() != null ? port.getStatus().name() : null,
                port.getIsActive()
        );
    }
}
