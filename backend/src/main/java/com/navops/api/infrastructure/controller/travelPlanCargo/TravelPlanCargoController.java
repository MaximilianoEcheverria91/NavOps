package com.navops.api.infrastructure.controller.travelPlanCargo;

import com.navops.api.application.dto.request.travelPlanCargo.TravelPlanCargoRequestDTO;
import com.navops.api.application.dto.response.travelPlanCargo.TravelPlanCargoResponseDTO;
import com.navops.api.application.service.travelPlanCargo.TravelPlanCargoService;
import com.navops.api.infrastructure.exception.CargoValidationException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/navigation/travel-plans")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Carga y Logística", description = "Endpoints para la gestión de cargas asociadas a un plan de viaje")
public class TravelPlanCargoController {

    private final TravelPlanCargoService cargoService;

    @Operation(summary = "Obtener cargas de un viaje",
            description = "Retorna todas las cargas activas (no eliminadas lógicamente) asociadas a un plan de viaje. " +
                    "Este endpoint alimenta la pantalla principal de gestión de carga y las 4 cards del dashboard de operaciones.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de cargas recuperada exitosamente",
                    content = @Content(schema = @Schema(implementation = TravelPlanCargoResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Plan de viaje no encontrado",
                    content = @Content(schema = @Schema(implementation = Map.class)))
    })
    @GetMapping("/{planId}/cargo")
    public ResponseEntity<List<TravelPlanCargoResponseDTO>> getCargosByPlanId(@PathVariable UUID planId) {
        log.info("GET /api/navigation/travel-plans/{}/cargo - Solicitando cargas activas", planId);
        List<TravelPlanCargoResponseDTO> response = cargoService.getCargosByPlanId(planId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Guardar cargas en un viaje",
            description = "Registra un lote de cargas asociadas a un plan de viaje. " +
                    "Recibe un listado de cargas y las persiste en la base de datos. " +
                    "Si algún valor de enumerado es inválido, se rechaza toda la operación con un 400.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cargas registradas exitosamente",
                    content = @Content(schema = @Schema(implementation = TravelPlanCargoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Error de validación en los datos enviados",
                    content = @Content(schema = @Schema(implementation = Map.class)))
    })
    @PostMapping("/{planId}/cargo")
    public ResponseEntity<?> saveCargos(
            @PathVariable UUID planId,
            @RequestBody @Valid List<TravelPlanCargoRequestDTO> requests) {
        log.info("POST /api/travel-plans/{}/cargo - Recibidas {} cargas para registrar", planId, requests.size());
        try {
            List<TravelPlanCargoResponseDTO> response = cargoService.saveCargos(planId, requests);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (CargoValidationException e) {
            log.error("Error de validación en la carga: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
