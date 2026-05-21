package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.request.ship.ShipCreateRequest;
import com.navops.api.application.dto.response.ship.ShipDetailResponse;
import com.navops.api.application.dto.response.ship.ShipSummaryResponse;
import com.navops.api.application.service.ShipService;
import com.navops.api.infrastructure.exception.ShipAlreadyExistsException;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/ships/")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Gestión de barcos", description = "Endpoints para la gestión de barcos")
public class ShipController {

    private final ShipService shipService;

    @Operation(summary = "Registrar nuevo barco", description = "Crea un registro de un barco y opcionalmente asocia una imagen principal.", responses = {
            @ApiResponse(responseCode = "201", description = "Barco registrado exitosamente", content = @Content(schema = @Schema(implementation = ShipDetailResponse.class))),
            @ApiResponse(responseCode = "400", description = "Error de validación de los datos enviados", content = @Content(schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "409", description = "Conflicto por datos duplicados (IMO o matrícula)", content = @Content(schema = @Schema(implementation = Map.class)))
    })
    @PostMapping("/create-ship")
    public ResponseEntity<?> createShip(
            @RequestPart("data") @Valid ShipCreateRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        log.info("Recibida petición para registrar barco IMO: {}", request.imoNumber());
        try {
            ShipDetailResponse response = shipService.createShip(request, image);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ShipAlreadyExistsException e) {
            log.error("Barco duplicado:", e);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            log.error("Argumento inválido:", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("ERROR AL REGISTRAR BARCO:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno: " + e.getMessage()));
        }
    }

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

    @Operation(summary = "Eliminar barco", description = "Elimina (soft delete) un barco por ID.", responses = {
            @ApiResponse(responseCode = "204", description = "Barco eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Barco no encontrado")
    })
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteShip(@PathVariable UUID id) {
        log.info("Petición recibida para eliminar barco id: {}", id);
        shipService.deleteShip(id);
        return ResponseEntity.noContent().build();
    }
}
