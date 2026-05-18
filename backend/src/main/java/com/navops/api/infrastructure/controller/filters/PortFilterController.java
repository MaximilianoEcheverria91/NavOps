package com.navops.api.infrastructure.controller.filters;

import com.navops.api.application.dto.request.port.PortFilterRequest;
import com.navops.api.application.dto.response.port.PortFilterResponse;
import com.navops.api.application.service.PortFilterService;
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
@RequestMapping("/api/v1/admin/")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Port Filters", description = "Endpoints para filtros avanzados de puertos")
public class PortFilterController {

    private final PortFilterService portFilterService;

    @Operation(
            summary = "Filtrar puertos con criterios avanzados",
            description = "Endpoint que permite filtrar puertos usando múltiples criterios opcionales. " +
                    "Todos los filtros son opcionales y se combinan con AND. Soporta paginación y ordenamiento.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Filtros aplicados correctamente",
                            content = @Content(schema = @Schema(implementation = PortFilterResponse.class))
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
    @PostMapping("/ports/filters")
    public ResponseEntity<PortFilterResponse> filterPorts(
            @Valid @RequestBody PortFilterRequest request) {
        log.info("Recibida petición de filtros avanzados de puertos");
        PortFilterResponse response = portFilterService.filterPorts(request);
        return ResponseEntity.ok(response);
    }
}
