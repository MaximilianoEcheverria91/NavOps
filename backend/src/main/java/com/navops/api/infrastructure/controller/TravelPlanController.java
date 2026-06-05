package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.request.travelPlan.TravelPlanFilterRequest;
import com.navops.api.application.dto.request.travelPlan.TravelPlanRequestDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanMetricsDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanResponseDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanSummaryResponseDTO;
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
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
