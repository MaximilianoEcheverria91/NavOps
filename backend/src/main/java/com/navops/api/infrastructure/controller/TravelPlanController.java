package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.request.travelPlan.TravelPlanFilterRequest;
import com.navops.api.application.dto.request.travelPlan.TravelPlanRequestDTO;
import com.navops.api.application.dto.response.travelPlan.GlobalVoyagesMetricsDTO;
import com.navops.api.application.dto.response.travelPlan.HistoryVoyagesMetricsDTO;
import com.navops.api.application.dto.response.travelPlan.MyVoyagesMetricsDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanMetricsDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanResponseDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanSummaryResponseDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanFullDetailDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanTelemetryResponseDTO;
import com.navops.api.application.service.travelPlan.TravelPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.navops.api.domain.entity.User;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/navigation/travel-plans")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Planes de Travesía", description = "Endpoints para la gestión de planes de travesía")
public class TravelPlanController {

    private final TravelPlanService travelPlanService;

    @Operation(
            summary = "Obtener métricas de planes de travesía",
            description = "Retorna métricas resumen: cantidad de planes PLANNED y total histórico de COMPLETED.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Métricas obtenidas correctamente",
                            content = @Content(schema = @Schema(implementation = TravelPlanMetricsDTO.class))
                    )
            }
    )
    @GetMapping("/metrics")
    public ResponseEntity<TravelPlanMetricsDTO> getMetrics() {
        log.info("Recibida petición de métricas de planes de travesía");
        return ResponseEntity.ok(travelPlanService.getMetrics());
    }

    @Operation(
            summary = "Obtener metricas globales de viajes",
            description = "Retorna conteos de viajes en progreso, planificados, demorados y total global.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Metricas obtenidas correctamente",
                            content = @Content(schema = @Schema(implementation = GlobalVoyagesMetricsDTO.class)))
            }
    )
    @GetMapping("/global-voyages/metrics")
    public ResponseEntity<GlobalVoyagesMetricsDTO> getGlobalVoyagesMetrics() {
        log.info("Recibida peticion de metricas globales de viajes");
        return ResponseEntity.ok(travelPlanService.getGlobalVoyagesMetrics());
    }

    @Operation(
            summary = "Obtener metricas de viajes del usuario autenticado",
            description = "Retorna conteos personales de viajes completados, planificados y cancelados.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Metricas personales obtenidas correctamente",
                            content = @Content(schema = @Schema(implementation = MyVoyagesMetricsDTO.class)))
            }
    )
    @GetMapping("/my-voyages/metrics")
    public ResponseEntity<MyVoyagesMetricsDTO> getMyVoyagesMetrics() {
        log.info("Recibida peticion de metricas de viajes personales");
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(travelPlanService.getMyVoyagesMetrics(user.getId()));
    }

    @Operation(
            summary = "Obtener metricas historicas de viajes",
            description = "Retorna conteos historicos de viajes completados y cancelados.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Metricas historicas obtenidas correctamente",
                            content = @Content(schema = @Schema(implementation = HistoryVoyagesMetricsDTO.class)))
            }
    )
    @GetMapping("/history-voyages/metrics")
    public ResponseEntity<HistoryVoyagesMetricsDTO> getHistoryVoyagesMetrics() {
        log.info("Recibida peticion de metricas de historial de viajes");
        return ResponseEntity.ok(travelPlanService.getHistoryVoyagesMetrics());
    }

    @Operation(
            summary = "Listar viajes asignados al usuario autenticado",
            description = "Retorna las travesias donde el usuario logueado figura como tripulante, ordenadas por fecha de salida ascendente.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Viajes asignados obtenidos correctamente",
                            content = @Content(schema = @Schema(implementation = TravelPlanSummaryResponseDTO.class))
                    )
            }
    )
    @GetMapping("/my-voyages")
    public ResponseEntity<List<TravelPlanSummaryResponseDTO>> getMyAssignedVoyages() {
        log.info("Recibida peticion de viajes asignados al usuario autenticado");
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(travelPlanService.getMyAssignedVoyages(user.getId()));
    }

    @Operation(
            summary = "Listar planes de travesía activos",
            description = "Retorna los planes activos excluyendo los estados COMPLETED y CANCELLED, y registros con borrado lógico.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Listado de planes activos obtenido correctamente",
                            content = @Content(schema = @Schema(implementation = TravelPlanSummaryResponseDTO.class))
                    )
            }
    )
    @GetMapping("/active")
    public ResponseEntity<List<TravelPlanSummaryResponseDTO>> getActiveTravelPlans() {
        log.info("Recibida petición de listado de planes de travesía activos");
        return ResponseEntity.ok(travelPlanService.getActiveTravelPlans());
    }

    @Operation(
            summary = "Buscar planes de travesía con filtros dinámicos",
            description = "Retorna una página de planes aplicando filtros dinámicos vía Criteria API. " +
                    "Los parámetros de paginación (page, size, sort) se pasan como query params en la URL.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Búsqueda ejecutada correctamente",
                            content = @Content(schema = @Schema(implementation = TravelPlanSummaryResponseDTO.class))
                    )
            }
    )
    @PostMapping("/search")
    public ResponseEntity<Page<TravelPlanSummaryResponseDTO>> searchTravelPlans(
            @RequestBody TravelPlanFilterRequest filter,
            Pageable pageable) {
        log.info("Recibida petición de búsqueda filtrada de planes de travesía");
        return ResponseEntity.ok(travelPlanService.getFilteredTravelPlans(filter, pageable));
    }

    @Operation(
            summary = "Obtener plan de travesía por ID",
            description = "Retorna un plan de travesía completo con escalas, barco, tripulación y carga.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Plan de travesía encontrado",
                            content = @Content(schema = @Schema(implementation = TravelPlanResponseDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Plan de travesía no encontrado",
                            content = @Content(schema = @Schema(implementation = com.navops.api.application.dto.response.ErrorResponseDto.class))
                    )
            }
    )
    @GetMapping("/{id}")
    public ResponseEntity<TravelPlanResponseDTO> getTravelPlanById(@PathVariable UUID id) {
        log.info("Recibida petición para obtener plan de travesía por ID: {}", id);
        return ResponseEntity.ok(travelPlanService.getTravelPlanById(id));
    }

    @Operation(
            summary = "Iniciar travesia en tiempo real",
            description = "Cambia el estado del plan a IN_PROGRESS, inicializa telemetria y registra lecturas de combustible.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Travesia iniciada exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Error de validacion de negocio"),
                    @ApiResponse(responseCode = "404", description = "Plan de travesia no encontrado")
            }
    )
    @PatchMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('ADMIN', 'CHIEF_NAVIGATION')")
    public ResponseEntity<TravelPlanResponseDTO> startTravelPlan(@PathVariable UUID id) {
        log.info("Recibida peticion para iniciar travesia en tiempo real ID: {}", id);
        return ResponseEntity.ok(travelPlanService.startTravelPlan(id));
    }

    @Operation(
            summary = "Obtener telemetria en tiempo real de una travesia",
            description = "Retorna datos de telemetria del plan: coordenadas actuales, origen, destino, escalas, tripulacion y estado.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Telemetria obtenida correctamente",
                            content = @Content(schema = @Schema(implementation = TravelPlanTelemetryResponseDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Plan de travesia no encontrado"
                    )
            }
    )
    @GetMapping("/{id}/telemetry")
    @PreAuthorize("hasAnyRole('ADMIN', 'CHIEF_NAVIGATION')")
    public ResponseEntity<TravelPlanTelemetryResponseDTO> getTelemetry(@PathVariable UUID id) {
        log.info("Recibida peticion de telemetria para plan ID: {}", id);
        return ResponseEntity.ok(travelPlanService.getTelemetryByPlanId(id));
    }

    @Operation(
            summary = "Obtener detalle completo de un plan de travesía para la UI",
            description = "Retorna un DTO compuesto con toda la información transaccional del viaje: buque, ruta, escalas, carga y tripulación.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Detalle completo obtenido correctamente",
                            content = @Content(schema = @Schema(implementation = TravelPlanFullDetailDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Plan de travesía no encontrado",
                            content = @Content(schema = @Schema(implementation = com.navops.api.application.dto.response.ErrorResponseDto.class))
                    )
            }
    )
    @GetMapping("/{id}/full-detail")
    public ResponseEntity<TravelPlanFullDetailDTO> getTravelPlanFullDetail(@PathVariable UUID id) {
        log.info("Recibida petición de detalle completo para plan ID: {}", id);
        return ResponseEntity.ok(travelPlanService.getTravelPlanFullDetail(id));
    }

    @Operation(
            summary = "Crear plan de travesia",
            description = "Crea un plan de travesia completo con escalas, tripulacion y carga.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Plan de travesía actualizado exitosamente",
                            content = @Content(schema = @Schema(implementation = TravelPlanResponseDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Error de validación de negocio o datos",
                            content = @Content(schema = @Schema(implementation = com.navops.api.application.dto.response.ErrorResponseDto.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Recurso no encontrado (plan, buque, puerto o tripulante)",
                            content = @Content(schema = @Schema(implementation = com.navops.api.application.dto.response.ErrorResponseDto.class))
                    )
            }
    )
    @PutMapping("/{id}")
    public ResponseEntity<TravelPlanResponseDTO> updateTravelPlan(
            @PathVariable UUID id,
            @Valid @RequestBody TravelPlanRequestDTO dto) {
        log.info("Recibida petición para actualizar plan de travesía ID: {}", id);
        TravelPlanResponseDTO response = travelPlanService.updateTravelPlan(id, dto);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Cancelar plan de travesía",
            description = "Cambia el estado del plan a CANCELLED. " +
                    "No permite cancelar planes en estado IN_PROGRESS, COMPLETED o ya CANCELLED.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Plan de travesía cancelado exitosamente",
                            content = @Content(schema = @Schema(implementation = TravelPlanResponseDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Error de validación de negocio",
                            content = @Content(schema = @Schema(implementation = com.navops.api.application.dto.response.ErrorResponseDto.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Plan de travesía no encontrado",
                            content = @Content(schema = @Schema(implementation = com.navops.api.application.dto.response.ErrorResponseDto.class))
                    )
            }
    )
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<TravelPlanResponseDTO> cancelTravelPlan(@PathVariable UUID id) {
        log.info("Recibida petición para cancelar plan de travesía ID: {}", id);
        return ResponseEntity.ok(travelPlanService.cancelTravelPlan(id));
    }

    @Operation(
            summary = "Crear plan de travesía",
            description = "Crea un plan de travesía completo con escalas, tripulación y carga. " +
                    "Persiste en cascada todas las entidades asociadas en una sola transacción ACID.",
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "Plan de travesía creado exitosamente",
                            content = @Content(schema = @Schema(implementation = TravelPlanResponseDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Error de validación de negocio o datos",
                            content = @Content(schema = @Schema(implementation = com.navops.api.application.dto.response.ErrorResponseDto.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Recurso no encontrado (buque, puerto o tripulante)",
                            content = @Content(schema = @Schema(implementation = com.navops.api.application.dto.response.ErrorResponseDto.class))
                    )
            }
    )
    @PostMapping
    public ResponseEntity<TravelPlanResponseDTO> createTravelPlan(
            @Valid @RequestBody TravelPlanRequestDTO dto) {
        log.info("Recibida petición para crear plan de travesía para buque ID: {}", dto.shipId());
        TravelPlanResponseDTO response = travelPlanService.createTravelPlan(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
