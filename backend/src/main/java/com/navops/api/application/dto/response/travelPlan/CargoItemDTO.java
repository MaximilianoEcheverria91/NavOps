package com.navops.api.application.dto.response.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "Item individual de carga del manifiesto")
public record CargoItemDTO(

    @Schema(description = "ID del item de carga")
    UUID id,

    @Schema(description = "Nombre del producto")
    String productName,

    @Schema(description = "Empresa propietaria de la carga")
    String owningCompany,

    @Schema(description = "Categoría del producto")
    String productCategory,

    @Schema(description = "Tipo de carga")
    String cargoType,

    @Schema(description = "Cantidad de unidades")
    int quantity,

    @Schema(description = "Peso en toneladas")
    double weightTonnes,

    @Schema(description = "Volumen en metros cúbicos")
    double volumeM3,

    @Schema(description = "Tipo de contenedor")
    String containerType

) {}
