package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.request.port.PortCreateRequest;
import com.navops.api.application.dto.response.port.PortDetailedResponse;
import com.navops.api.application.dto.response.port.PortResponse;
import com.navops.api.application.dto.response.port.PortSummaryResponse;
import com.navops.api.application.service.PortService;
import com.navops.api.infrastructure.exception.PortAlreadyExistsException;
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
@RequestMapping("/api/v1/admin/ports/")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Gestión de puertos", description = "Endpoints para la gestión de puertos")
public class PortController {

    private final PortService portService;

    // POST Crear Puertos
    @Operation(summary = "Registrar nuevo puerto", description = "Crea un registro de un puerto y opcionalmente asocia una imagen principal.", responses = {
            @ApiResponse(responseCode = "201", description = "Puerto registrado exitosamente", content = @Content(schema = @Schema(implementation = PortResponse.class))),
            @ApiResponse(responseCode = "400", description = "Error de validación de los datos enviados", content = @Content(schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "409", description = "Conflicto por datos duplicados (Ej. Código de puerto)", content = @Content(schema = @Schema(implementation = Map.class)))
    })
    @PostMapping("/create-port")
    public ResponseEntity<?> createPort(
            @RequestPart("data") @Valid PortCreateRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        log.info("Recibida petición para registrar puerto código: {}", request.code());
        try {
            PortResponse response = portService.createPort(request, image);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (PortAlreadyExistsException e) {
            log.error("Puerto duplicado:", e);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            log.error("Argumento inválido:", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("ERROR AL REGISTRAR PUERTO:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno: " + e.getMessage()));
        }
    }

    //GET Obtener Listado DE Puertos
    @Operation(summary = "Obtener puertos activos", description = "Retorna un listado resumido de todos los puertos que se encuentran activos.", responses = {
            @ApiResponse(responseCode = "200", description = "Listado recuperado exitosamente", content = @Content(schema = @Schema(implementation = com.navops.api.application.dto.response.port.PortSummaryResponse.class))),
            @ApiResponse(responseCode = "204", description = "No se encontraron puertos activos en el sistema")
    })
    @GetMapping("/allPorts-active")
    public ResponseEntity<List<PortSummaryResponse>> getAllActivePorts() {
        log.info("Petición recibida para obtener la lista de puertos activos");
        List<PortSummaryResponse> response = portService.getAllActivePorts();
        return ResponseEntity.ok(response);
    }

   
    @GetMapping("/{id}")
    public ResponseEntity<?> getPortById(@PathVariable("id") UUID id){
        log.info("Petición recibida para obtener detalle completo del puerto seleccionado");
        PortDetailedResponse responses = portService.getPortById(id);
        return ResponseEntity.ok(responses);
    }


}
