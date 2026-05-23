package com.navops.api.infrastructure.controller.filters;

import com.navops.api.application.dto.request.ship.ShipFilterRequest;
import com.navops.api.application.dto.response.ship.ShipFilterResponse;
import com.navops.api.application.service.filter.ShipFilterService;
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
@Tag(name = "Ship Filters", description = "Endpoints para filtros avanzados de barcos")
public class ShipFilterController {

    private final ShipFilterService shipFilterService;

    @Operation(
            summary = "Filtrar barcos con criterios avanzados",
            description = "Endpoint que permite filtrar barcos usando múltiples criterios opcionales. " +
                    "Todos los filtros son opcionales y se combinan con AND. Soporta paginación y ordenamiento.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Filtros aplicados correctamente",
                            content = @Content(schema = @Schema(implementation = ShipFilterResponse.class))
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
    @PostMapping("/ships/filters")
    public ResponseEntity<ShipFilterResponse> filterShips(
            @Valid @RequestBody ShipFilterRequest request) {
        log.info("Recibida petición de filtros avanzados de barcos");
        ShipFilterResponse response = shipFilterService.filterShips(request);
        return ResponseEntity.ok(response);
    }
}
