package com.navops.api.application.service.travelPlanCargo;

import com.navops.api.application.dto.request.travelPlanCargo.TravelPlanCargoRequestDTO;
import com.navops.api.application.dto.response.travelPlanCargo.TravelPlanCargoResponseDTO;
import com.navops.api.domain.entity.TravelPlan;
import com.navops.api.domain.entity.TravelPlanCargo;
import com.navops.api.domain.enums.travelPlanCargo.CargoStatusEnum;
import com.navops.api.domain.enums.travelPlanCargo.CargoTypeEnum;
import com.navops.api.domain.enums.travelPlanCargo.ContainerTypeEnum;
import com.navops.api.domain.enums.travelPlanCargo.ProductCategoryEnum;
import com.navops.api.infrastructure.exception.CargoValidationException;
import com.navops.api.infrastructure.exception.ResourceNotFoundException;
import com.navops.api.repository.TravelPlanCargoRepository;
import com.navops.api.repository.TravelPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TravelPlanCargoServiceImpl implements TravelPlanCargoService {

    private final TravelPlanCargoRepository repository;
    private final TravelPlanRepository travelPlanRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TravelPlanCargoResponseDTO> getCargosByPlanId(UUID planId) {
        log.info("Obteniendo cargas activas para el plan de viaje ID: {}", planId);
        List<TravelPlanCargo> cargos = repository.findByTravelPlanIdAndDeletedAtIsNull(planId);
        return cargos.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public List<TravelPlanCargoResponseDTO> saveCargos(UUID planId, List<TravelPlanCargoRequestDTO> requests) {
        log.info("Guardando lote de {} cargas para el plan de viaje ID: {}", requests.size(), planId);

        List<TravelPlanCargo> entities = requests.stream()
                .map(dto -> buildEntity(planId, dto))
                .toList();

        List<TravelPlanCargo> saved = repository.saveAll(entities);
        log.info("Lote guardado exitosamente. Total: {}", saved.size());

        return saved.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    private TravelPlanCargo buildEntity(UUID planId, TravelPlanCargoRequestDTO dto) {
        try {
            TravelPlan travelPlan = travelPlanRepository.findByIdAndDeletedAtIsNull(planId)
                    .orElseThrow(() -> new ResourceNotFoundException("Plan de travesía no encontrado con ID: " + planId));
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
                    .containerType(ContainerTypeEnum.valueOf(dto.containerType().toUpperCase()))
                    .hazardousMaterial(dto.hazardousMaterial())
                    .description(dto.description())
                    .status(CargoStatusEnum.valueOf(dto.status().toUpperCase()))
                    .build();
        } catch (IllegalArgumentException e) {
            log.error("Error de validación al mapear carga: {}", e.getMessage());
            throw new CargoValidationException("Valor inválido en los campos enumerados: " + e.getMessage());
        }
    }

    private TravelPlanCargoResponseDTO toResponseDTO(TravelPlanCargo entity) {
        return new TravelPlanCargoResponseDTO(
                entity.getId(),
                entity.getTravelPlan().getId(),
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
