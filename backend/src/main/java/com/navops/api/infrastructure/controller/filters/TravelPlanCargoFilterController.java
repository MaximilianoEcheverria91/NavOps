package com.navops.api.infrastructure.controller.filters;

import com.navops.api.application.dto.request.travelPlanCargo.TravelPlanCargoFilterRequest;
import com.navops.api.application.dto.response.travelPlanCargo.TravelPlanCargoFilterResponse;
import com.navops.api.application.service.filter.TravelPlanCargoFilterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Travel Plan Cargo Filters", description = "Endpoints para filtros avanzados de cargas")
public class TravelPlanCargoFilterController {

    private final TravelPlanCargoFilterService cargoFilterService;

    @Operation(
            summary = "Filtrar cargas con criterios avanzados",
            description = "Endpoint que permite filtrar cargas de un plan de viaje usando múltiples criterios opcionales. " +
                    "Todos los filtros se combinan con AND. Soporta paginación y ordenamiento.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Filtros aplicados correctamente",
                            content = @Content(schema = @Schema(implementation = TravelPlanCargoFilterResponse.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Error de validación en los filtros",
                            content = @Content(schema = @Schema(implementation = java.util.Map.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Error interno del servidor",
                            content = @Content(schema = @Schema(implementation = java.util.Map.class))
                    )
            }
    )
    @PostMapping("/travel-plans/cargos/filters")
    public ResponseEntity<TravelPlanCargoFilterResponse> filterCargos(
            @Valid @RequestBody TravelPlanCargoFilterRequest request) {
        log.info("Recibida petición de filtros avanzados de cargas");
        TravelPlanCargoFilterResponse response = cargoFilterService.filterCargos(request);
        return ResponseEntity.ok(response);
    }
}
