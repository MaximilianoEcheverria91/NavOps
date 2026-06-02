package com.navops.api.application.service.filter;

import com.navops.api.application.dto.request.travelPlanCargo.TravelPlanCargoFilterRequest;
import com.navops.api.application.dto.response.travelPlanCargo.TravelPlanCargoFilterResponse;
import com.navops.api.application.dto.response.travelPlanCargo.TravelPlanCargoResponseDTO;
import com.navops.api.domain.entity.TravelPlanCargo;
import com.navops.api.domain.specification.TravelPlanCargoFilterSpecification;
import com.navops.api.repository.filters.TravelPlanCargoFilterRepository;
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
public class TravelPlanCargoFilterService {

    private final TravelPlanCargoFilterRepository filterRepository;

    @Transactional(readOnly = true)
    public TravelPlanCargoFilterResponse filterCargos(TravelPlanCargoFilterRequest request) {
        log.info("Ejecutando filtros avanzados de cargas para planId: {}", request.planId());

        Specification<TravelPlanCargo> spec = TravelPlanCargoFilterSpecification.build(
                request.planId(),
                request.productCategory(),
                request.cargoType(),
                request.containerType()
        );

        Sort sort = TravelPlanCargoFilterSpecification.getSortDirection(request.sortBy(), request.sortDirection());
        PageRequest pageRequest = PageRequest.of(request.page(), request.size(), sort);

        Page<TravelPlanCargo> page = filterRepository.findAll(spec, pageRequest);

        List<TravelPlanCargoResponseDTO> content = page.getContent().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());

        return new TravelPlanCargoFilterResponse(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast(),
                page.isFirst()
        );
    }

    private TravelPlanCargoResponseDTO mapToResponseDTO(TravelPlanCargo entity) {
        return new TravelPlanCargoResponseDTO(
                entity.getId(),
                entity.getPlanId(),
                entity.getProductName(),
                entity.getProductCategory().name(),
                entity.getProductType(),
                entity.getCargoType().name(),
                entity.getQuantity(),
                entity.getWeightTonnes(),
                entity.getVolumeM3(),
                entity.getOwningCompany(),
                entity.getContainerType().name(),
                entity.isHazardousMaterial(),
                entity.getDescription(),
                entity.getStatus().name(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
