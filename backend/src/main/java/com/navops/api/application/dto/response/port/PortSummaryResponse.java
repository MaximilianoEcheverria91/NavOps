package com.navops.api.application.dto.response.port;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "DTO para el listado resumido de puertos en las cards")
public record PortSummaryResponse(
    @Schema(description = "ID del puerto", example = "550e8400-e29b-41d4-a716-446655440000")
    UUID id,
    
    @Schema(description = "URL de la imagen principal del puerto")
    String mainImageUrl,
    
    @Schema(description = "Nombre del puerto", example = "Puerto Mar del Plata")
    String name,
    
    @Schema(description = "Código internacional del puerto", example = "ARMDQ")
    String code,
    
    @Schema(description = "Nombre del país", example = "Argentina")
    String countryName,
    
    @Schema(description = "Nombre de la provincia", example = "Buenos Aires")
    String provinceName,
    
    @Schema(description = "Nombre de la ciudad", example = "Mar del Plata")
    String cityName,
    
    @Schema(description = "Estado actual del puerto", example = "OPERATIONAL")
    String status,
    
    @Schema(description = "Indica si el puerto está activo o ha sido dado de baja lógicamente")
    Boolean isActive,

    @Schema(description = "La latitud del la ubicación del puerto", example = "-5412309")
    double latitude,

    @Schema(description = "La longitud de la ubicación del puerto", example = "-45123564")
    double longitude
) {}
