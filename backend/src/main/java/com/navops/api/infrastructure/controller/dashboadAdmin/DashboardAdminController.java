package com.navops.api.infrastructure.controller.dashboadAdmin;

import com.navops.api.application.dto.response.dashboardAdmin.PeopleStatusCountResponse;
import com.navops.api.application.service.dashboardAdmin.DashboardAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Dashboard Admin", description = "Endpoints para el dashboard del administrador")
public class DashboardAdminController {

    private final DashboardAdminService dashboardAdminService;

    @Operation(
            summary = "Obtener conteo de usuarios por estado",
            description = "Retorna la cantidad de usuarios agrupados por cada estado: " +
                    "ACTIVE, INACTIVE, VACATION, MEDICAL_LEAVE y SUSPENDED.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Conteo obtenido correctamente",
                            content = @Content(schema = @Schema(implementation = PeopleStatusCountResponse.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Error interno del servidor",
                            content = @Content(schema = @Schema(implementation = java.util.Map.class))
                    )
            }
    )
    @GetMapping("/users/status-count")
    public ResponseEntity<PeopleStatusCountResponse> countUsersByStatus() {
        log.info("Solicitando conteo de usuarios por estado");
        PeopleStatusCountResponse response = dashboardAdminService.countUsersByStatus();
        return ResponseEntity.ok(response);
    }
}
