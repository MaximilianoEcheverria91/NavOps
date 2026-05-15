package com.navops.api.infrastructure.controller.filters;

import com.navops.api.application.dto.request.user.PersonnelFilterRequest;
import com.navops.api.application.dto.response.user.PersonnelFilterResponse;
import com.navops.api.application.service.PersonnelFilterService;
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
@Tag(name = "User Filters", description = "Endpoints para filtros avanzados de usuarios")
public class PersonnelFilterController {

    private final PersonnelFilterService personnelFilterService;

    @Operation(
            summary = "Filtrar personal con criterios avanzados",
            description = "Endpoint que permite filtrar usuarios/personal usando múltiples criterios opcionales. " +
                    "Todos los filtros son opcionales y se combinan con AND. Soporta paginación y ordenamiento.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Filtros aplicados correctamente",
                            content = @Content(schema = @Schema(implementation = PersonnelFilterResponse.class))
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
    @PostMapping("/filters")
    public ResponseEntity<PersonnelFilterResponse> filterPersonnel(
            @Valid @RequestBody PersonnelFilterRequest request) {
        log.info("Recibida petición de filtros avanzados de personal");
        PersonnelFilterResponse response = personnelFilterService.filterPersonnel(request);
        return ResponseEntity.ok(response);
    }
}
