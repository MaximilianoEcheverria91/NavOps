package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.request.travelPlan.TravelPlanRequestDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanResponseDTO;
import com.navops.api.application.service.travelPlan.TravelPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/navigation/travel-plans")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Planes de Travesía", description = "Endpoints para la gestión de planes de travesía")
public class TravelPlanController {

    private final TravelPlanService travelPlanService;

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
