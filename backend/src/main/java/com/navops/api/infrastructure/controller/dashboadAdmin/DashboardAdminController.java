package com.navops.api.infrastructure.controller.dashboadAdmin;

import com.navops.api.application.dto.response.dashboardAdmin.PeopleStatusCountResponse;
import com.navops.api.application.dto.response.dashboardAdmin.PortStatusCountResponse;
import com.navops.api.application.dto.response.dashboardAdmin.ShipStatusCountResponse;
import com.navops.api.application.dto.response.dashboardAdmin.UserSystemAccessCountResponse;
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

    @Operation(
            summary = "Obtener conteo de puertos por estado",
            description = "Retorna la cantidad de puertos agrupados por cada estado: " +
                    "OPERATIONAL, UNDER_MAINTENANCE, CLOSED, FULL e INACTIVE.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Conteo obtenido correctamente",
                            content = @Content(schema = @Schema(implementation = PortStatusCountResponse.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Error interno del servidor",
                            content = @Content(schema = @Schema(implementation = java.util.Map.class))
                    )
            }
    )
    @GetMapping("/ports/status-count")
    public ResponseEntity<PortStatusCountResponse> countPortsByStatus() {
        log.info("Solicitando conteo de puertos por estado");
        PortStatusCountResponse response = dashboardAdminService.countPortsByStatus();
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Obtener conteo de barcos por estado",
            description = "Retorna la cantidad de barcos agrupados por cada estado: " +
                    "OPERATIONAL, MAINTENANCE, REPAIR, IN_TRANSIT, OUT_OF_SERVICE e INACTIVE.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Conteo obtenido correctamente",
                            content = @Content(schema = @Schema(implementation = ShipStatusCountResponse.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Error interno del servidor",
                            content = @Content(schema = @Schema(implementation = java.util.Map.class))
                    )
            }
    )
    @GetMapping("/ships/status-count")
    public ResponseEntity<ShipStatusCountResponse> countShipsByStatus() {
        log.info("Solicitando conteo de barcos por estado");
        ShipStatusCountResponse response = dashboardAdminService.countShipsByStatus();
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Obtener conteo de usuarios del sistema por tipo de acceso",
            description = "Retorna la cantidad de usuarios por rol (ADMIN, CHIEF_NAVIGATION, CHIEF_OPERATIONS), " +
                    "activos, bloqueados, inactivos y el total sumando solo los 3 roles.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Conteo obtenido correctamente",
                            content = @Content(schema = @Schema(implementation = UserSystemAccessCountResponse.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Error interno del servidor",
                            content = @Content(schema = @Schema(implementation = java.util.Map.class))
                    )
            }
    )
    @GetMapping("/users/system-access-count")
    public ResponseEntity<UserSystemAccessCountResponse> countUsersBySystemAccess() {
        log.info("Solicitando conteo de usuarios del sistema por tipo de acceso");
        UserSystemAccessCountResponse response = dashboardAdminService.countUsersBySystemAccess();
        return ResponseEntity.ok(response);
    }
}
