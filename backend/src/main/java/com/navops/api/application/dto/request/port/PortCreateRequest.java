package com.navops.api.application.dto.request.port;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(description = "DTO para la creación de un nuevo Puerto")
public record PortCreateRequest(
    
    @NotBlank(message = "El nombre del puerto es obligatorio")
    @Schema(description = "Nombre del puerto", example = "Puerto de Buenos Aires")
    String name,

    @NotBlank(message = "El tipo de puerto es obligatorio")
    @Schema(description = "Tipo de puerto (ej. Comercial, Pasajeros)", example = "Comercial")
    String portType,

    @NotBlank(message = "El tipo de muelle")
    @Schema(description = "Tipo de muelle (ej. Sólido, Flotante)", example = "Sólido")
    String dockType,

    @NotBlank(message = "El código del puerto es obligatorio")
    @Schema(description = "Código único del puerto (UN/LOCODE)", example = "ARBUE")
    String code,

    @Schema(description = "Teléfono de contacto del puerto", example = "+54 11 4343-XXXX")
    String contactPhone,

    @Schema(description = "Email de contacto del puerto", example = "info@puertobuenosaires.gob.ar")
    String contactEmail,

    @Schema(description = "Zona horaria del puerto", example = "UTC-3")
    String timezone,

    @NotNull(message = "La latitud es obligatoria")
    @Schema(description = "Latitud geográfica", example = "-34.5833")
    Double latitude,

    @NotNull(message = "La longitud es obligatoria")
    @Schema(description = "Longitud geográfica", example = "-58.3667")
    Double longitude,

    @Schema(description = "Cantidad de muelles disponibles", example = "10")
    Short dockCount,

    @Schema(description = "Eslora máxima permitida (metros)", example = "300.0")
    Double maxLength,

    @Schema(description = "Calado máximo permitido (metros)", example = "10.5")
    Double maxDraft,

    @NotNull(message = "El ID del país es obligatorio")
    @Schema(description = "ID del país donde se ubica el puerto")
    UUID countryId,

    @NotNull(message = "El ID de la provincia es obligatorio")
    @Schema(description = "ID de la provincia/estado")
    UUID provinceId,

    @NotNull(message = "El ID de la ciudad es obligatorio")
    @Schema(description = "ID de la ciudad")
    UUID cityId
) {}
