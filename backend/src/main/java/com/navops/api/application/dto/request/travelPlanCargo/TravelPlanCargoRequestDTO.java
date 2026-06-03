package com.navops.api.application.dto.request.travelPlanCargo;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

@Schema(description = "DTO para crear o actualizar una carga asociada a un plan de viaje")
public record TravelPlanCargoRequestDTO(

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Schema(description = "Nombre del producto", example = "Arroz blanco")
    String productName,

    @NotBlank(message = "La categoría del producto es obligatoria")
    @Schema(description = "Categoría del producto", example = "FOOD_AND_BEVERAGES")
    String productCategory,

    @NotBlank(message = "El tipo de producto es obligatorio")
    @Schema(description = "Tipo de producto", example = "Granos")
    String productType,

    @NotBlank(message = "El tipo de carga es obligatorio")
    @Schema(description = "Tipo de carga", example = "BULK")
    String cargoType,

    @NotNull(message = "La cantidad es obligatoria")
    @Positive(message = "La cantidad debe ser un valor positivo")
    @Schema(description = "Cantidad de unidades", example = "500")
    Integer quantity,

    @NotNull(message = "El peso es obligatorio")
    @Positive(message = "El peso debe ser un valor positivo")
    @Schema(description = "Peso en toneladas", example = "25.50")
    BigDecimal weightTonnes,

    @NotNull(message = "El volumen es obligatorio")
    @Positive(message = "El volumen debe ser un valor positivo")
    @Schema(description = "Volumen en metros cúbicos", example = "120.00")
    BigDecimal volumeM3,

    @NotBlank(message = "La empresa propietaria es obligatoria")
    @Schema(description = "Empresa propietaria de la carga", example = "Logística Naviera S.A.")
    String owningCompany,

    @NotBlank(message = "El tipo de contenedor es obligatorio")
    @Schema(description = "Tipo de contenedor", example = "DRY_VAN")
    String containerType,

    @Schema(description = "Indica si es material peligroso", example = "false")
    boolean hazardousMaterial,

    @Schema(description = "Descripción adicional de la carga", example = "Producto perecedero - mantener refrigerado")
    String description,

    @NotBlank(message = "El estado es obligatorio")
    @Schema(description = "Estado de la carga", example = "LOADED")
    String status

) {}
