package com.navops.api.infrastructure.controller.dashboard;

import com.navops.api.application.service.dashboard.DashboardAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Personnel Management", description = "Endpoints para la gestión de personal, tripulación y usuarios")
public class DashboardAdminController {

    private final DashboardAdminService dashboardAdminService;

    @Operation(summary = "Obtener estadísticas del dashboard", description = "Retorna conteos de usuarios totales, activos y tripulantes disponibles.")
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {

        try {
            log.info("Petición de estadísticas recibida");
            return ResponseEntity.ok(dashboardAdminService.getAdminDashboardStats());
        }catch (Exception e) {
            log.error("Error crítico en el endpoint de dashboard: ", e);
            // Podés dejar que el error siga su camino o devolver un 500 manual
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudieron cargar las estadísticas"));
        }
    }
}
