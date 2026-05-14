package com.navops.api.application.dto.response.ship;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "DTO para el listado resumido de barcos en las cards")
public record ShipSummaryResponse(
    @Schema(description = "ID del barco") UUID id,
    @Schema(description = "Nombre del barco", example = "Libertador") String name,
    @Schema(description = "Matrícula", example = "2-SE-2-158-97") String registration,
    @Schema(description = "Número IMO", example = "9176187") String imoNumber,
    @Schema(description = "URL de la imagen principal") String mainImageUrl,
    @Schema(description = "Estado operativo", example = "OPERATIONAL") String status
) {}