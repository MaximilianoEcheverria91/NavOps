package com.navops.api.application.dto.response.travelPlanCargo;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Schema(description = "DTO de respuesta con los datos completos de una carga del plan de viaje")
public record TravelPlanCargoResponseDTO(

    @Schema(description = "ID único de la carga")
    UUID id,

    @Schema(description = "ID del plan de viaje asociado")
    UUID planId,

    @Schema(description = "Nombre del producto", example = "Arroz blanco")
    String productName,

    @Schema(description = "Categoría del producto", example = "FOOD_AND_BEVERAGES")
    String productCategory,

    @Schema(description = "Tipo de producto", example = "Granos")
    String productType,

    @Schema(description = "Tipo de carga", example = "BULK")
    String cargoType,

    @Schema(description = "Cantidad de unidades", example = "500")
    Integer quantity,

    @Schema(description = "Peso en toneladas", example = "25.50")
    BigDecimal weightTonnes,

    @Schema(description = "Volumen en metros cúbicos", example = "120.00")
    BigDecimal volumeM3,

    @Schema(description = "Empresa propietaria", example = "Logística Naviera S.A.")
    String owningCompany,

    @Schema(description = "Tipo de contenedor", example = "DRY_VAN")
    String containerType,

    @Schema(description = "Es material peligroso", example = "false")
    boolean hazardousMaterial,

    @Schema(description = "Descripción adicional", example = "Producto perecedero")
    String description,

    @Schema(description = "Estado de la carga", example = "LOADED")
    String status,

    @Schema(description = "Fecha de creación")
    OffsetDateTime createdAt,

    @Schema(description = "Fecha de última actualización")
    OffsetDateTime updatedAt

) {}
