package com.navops.api.application.dto.response.port;

import com.navops.api.domain.enums.PortStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "DTO para el detalle completo del puerto por ID")
public record PortDetailedResponse(

        @Schema(description = "ID del puerto")
        UUID id,

        @Schema(description = "Nombre del puerto", example = "Puerto Mar del Plata")
        String name,

        @Schema(description = "Nombre del Código internacional del puerto", example = "DJAER")
        String code,

        @Schema(description = "Tipo de Puerto",  example = "Pesquero, mercantil, militar, etc.")
        String portType,

        @Schema(description = "Tipo mulle del puerto", example = "Sólido, flotante, espigón, etc")
        String dockType,

        @Schema(description = "La latitud del la ubicación del puerto", example = "-5412309")
        double latitude,

        @Schema(description = "La longitud de la ubicación del puerto", example = "-45123564")
        double longitude,

        @Schema(description = "Cantidad de muelles que tiene el puerto", example = "30")
        Short dockCount,

        @Schema(description = "Maximo eslora permitido en el puerto", example = "250.5")
        double maxLength,

        @Schema(description = "Maximo calado permitido en el puerto", example = "13")
        double maxDraft,

        @Schema(description = "Pais donde esta ubicado el puerto", example = "Argentina")
        String country,

        @Schema(description = "Provincia o estado donde esta ubicado el puerto", example = "Buenos Aires")
        String province,

        @Schema(description = "Ciudad o localidad donde esta ubicado el puerto", example = "Dock Sud")
        String city,

        @Schema(description = "Imagen del puerto", example = "https://res.cloudinary.com/demo/image/upload/sample.jpg")
        String mainImageUrl,

        @Schema(description = "Número de contacto del puerto", example = "11 4578 2312")
        String contactPhone,

        @Schema(description = "Correo electrónico del puerto", example = "PuertoDockSud@gmail.com")
        String contactEmail,

        @Schema(description = "Sitio web del puerto", example = "https://puertoDockSub.com.ar")
        String contactWeb,

        @Schema(description = "Zona horaria del puerto para medir duración de viaje", example = "UTC-5")
        String timezone,

        @Schema(description = "Estado actual del puerto", example = "Habilitado, lleno, en mantenimiento, etc")
        String status,

        @Schema(description = "Estado del puerto dentro del sistema", example = "true o false")
        Boolean isActive

) {}
