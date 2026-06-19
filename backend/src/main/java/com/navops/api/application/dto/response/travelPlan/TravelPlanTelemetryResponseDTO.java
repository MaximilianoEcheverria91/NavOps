package com.navops.api.application.dto.response.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Schema(description = "DTO de respuesta para telemetria en tiempo real de una travesia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelPlanTelemetryResponseDTO {

    @Schema(description = "ID del plan de travesia")
    private UUID id;

    @Schema(description = "Nombre del buque")
    private String shipName;

    @Schema(description = "Estado del viaje")
    private String status;

    @Schema(description = "Cantidad de tripulantes en la travesia")
    private int crewCount;

    @Schema(description = "Fecha y hora de partida")
    private OffsetDateTime departureTime;

    @Schema(description = "Fecha y hora estimada de llegada")
    private OffsetDateTime eta;

    @Schema(description = "Porcentaje de combustible restante")
    private BigDecimal fuelPercentage;

    @Schema(description = "Total de toneladas de carga")
    private BigDecimal totalCargoTonnes;

    @Schema(description = "Horas de demora")
    private BigDecimal delayHours;

    @Schema(description = "Estado del motor")
    private String currentEngineStatus;

    @Schema(description = "Latitud actual")
    private BigDecimal currentLatitude;

    @Schema(description = "Longitud actual")
    private BigDecimal currentLongitude;

    @Schema(description = "Puerto de origen")
    private PortCoordsDTO origin;

    @Schema(description = "Puerto de destino")
    private PortCoordsDTO destination;

    @Schema(description = "Lista de escalas")
    private List<StopCoordsDTO> stops;

    @Schema(description = "Coordenadas de un puerto")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PortCoordsDTO {

        @Schema(description = "Nombre del puerto")
        private String name;

        @Schema(description = "Latitud")
        private Double latitude;

        @Schema(description = "Longitud")
        private Double longitude;
    }

    @Schema(description = "Coordenadas de una escala")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StopCoordsDTO {

        @Schema(description = "Nombre del puerto de la escala")
        private String portName;

        @Schema(description = "Latitud")
        private Double latitude;

        @Schema(description = "Longitud")
        private Double longitude;

        @Schema(description = "Orden de la escala")
        private Integer sequence;
    }
}
