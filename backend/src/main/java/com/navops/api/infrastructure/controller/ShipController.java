package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.response.ship.ShipDetailResponse;
import com.navops.api.application.dto.response.ship.ShipSummaryResponse;
import com.navops.api.application.service.ShipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/ships/")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Gestión de barcos", description = "Endpoints para la gestión de barcos")
public class ShipController {

    private final ShipService shipService;

    @Operation(summary = "Listar barcos", description = "Retorna un listado resumido de todos los barcos registrados.")
    @GetMapping
    public ResponseEntity<List<ShipSummaryResponse>> getAll() {
        log.info("Petición recibida para listar barcos");
        return ResponseEntity.ok(shipService.getAll());
    }

    @Operation(summary = "Detalle de barco", description = "Retorna el detalle completo de un barco por ID.")
    @GetMapping("{id}")
    public ResponseEntity<ShipDetailResponse> getById(@PathVariable UUID id) {
        log.info("Petición recibida para detalle de barco id: {}", id);
        return ResponseEntity.ok(shipService.getById(id));
    }
}
