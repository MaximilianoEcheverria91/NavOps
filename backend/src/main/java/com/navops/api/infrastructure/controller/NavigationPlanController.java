package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.request.navigation.NavigationPlanCreateRequest;
import com.navops.api.application.dto.response.navigation.NavigationPlanDetailResponse;
import com.navops.api.application.dto.response.navigation.NavigationPlanSummaryResponse;
import com.navops.api.application.service.NavigationPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/navigation-plans")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Planificación de Travesía", description = "Endpoints para la gestión de planes de navegación")
public class NavigationPlanController {

    private final NavigationPlanService navigationPlanService;

    @Operation(summary = "Crear plan de navegación")
    @PostMapping
    public ResponseEntity<NavigationPlanDetailResponse> createPlan(@RequestBody @Valid NavigationPlanCreateRequest request) {
        log.info("Petición para crear plan de navegación: {}", request.name());
        return ResponseEntity.status(HttpStatus.CREATED).body(navigationPlanService.createPlan(request));
    }

    @Operation(summary = "Listar planes de navegación")
    @GetMapping
    public ResponseEntity<List<NavigationPlanSummaryResponse>> getAll() {
        log.info("Petición para listar planes de navegación");
        return ResponseEntity.ok(navigationPlanService.getAll());
    }

    @Operation(summary = "Detalle de plan de navegación")
    @GetMapping("/{id}")
    public ResponseEntity<NavigationPlanDetailResponse> getById(@PathVariable UUID id) {
        log.info("Petición para obtener detalle del plan: {}", id);
        return ResponseEntity.ok(navigationPlanService.getById(id));
    }

    @Operation(summary = "Eliminar plan de navegación")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable UUID id) {
        log.info("Petición para eliminar plan: {}", id);
        navigationPlanService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
}
