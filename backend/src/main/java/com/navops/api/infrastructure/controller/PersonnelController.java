package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.request.user.PersonnelRegistrationRequest;
import com.navops.api.application.dto.request.user.StatusUpdateRequest;
import com.navops.api.application.dto.request.user.UserUpdateRequest;
import com.navops.api.application.service.PersonnelService;
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

import com.navops.api.application.dto.response.user.PersonnelSummaryResponse;
import com.navops.api.application.dto.response.user.PersonnelDetailedResponse;
import com.navops.api.application.dto.response.user.PersonnelEditResponse;

@RestController
@RequestMapping("/api/v1/admin/")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Personnel Management", description = "Endpoints para la gestión de personal, tripulación y usuarios")
public class PersonnelController {

    private final PersonnelService personnelService;

    // CREATE USER
    @Operation(summary = "Registrar nuevo personal", description = "Crea un registro de persona, tripulante y opcionalmente un usuario del sistema.", responses = {
            @ApiResponse(responseCode = "201", description = "Personal registrado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Error de validación de los datos enviados", content = @Content(schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "409", description = "Conflicto por datos duplicados (Ej. DNI o Email)", content = @Content(schema = @Schema(implementation = Map.class)))
    })
    @PostMapping("/create-user")
    public ResponseEntity<Map<String, String>> registerPersonnel(
            @RequestPart("data") @Valid PersonnelRegistrationRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        log.info("Recibida petición para registrar personal documento: {}", request.generalInfo().documentNumber());
        try {
            personnelService.registerPersonnel(request, image);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Personal registrado exitosamente."));
        } catch (Exception e) {
            log.error("ERROR AL REGISTRAR:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno: " + e.getMessage()));
        }
    }

    // ENDPOINT PARA DASHBOARD
    @Operation(summary = "Obtener Contador de usuarios", description = "Retorna conteos de usuarios totales, activos y tripulantes disponibles.")
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getStatsUser() {

        try {
            log.info("Petición de estadísticas recibida");
            return ResponseEntity.ok(personnelService.getStatsUser());
        } catch (Exception e) {
            log.error("Error crítico en el endpoint de dashboard: ", e);
            // Podés dejar que el error siga su camino o devolver un 500 manual
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudieron cargar las estadísticas"));
        }
    }

    // OBTENER TODO EL PERSONAL (Resumen)
    @Operation(summary = "Obtener lista de personal (Resumen)", description = "Devuelve el nombre, apellido, cargo, legajo, antigüedad, rol y libreta marítima de cada usuario.", responses = {
            @ApiResponse(responseCode = "200", description = "Lista de personal obtenida exitosamente"),
            @ApiResponse(responseCode = "404", description = "No se encontraron registros de personal", content = @Content(schema = @Schema(implementation = com.navops.api.application.dto.response.ErrorResponseDto.class)))
    })
    @GetMapping("/all-user")
    public ResponseEntity<List<PersonnelSummaryResponse>> getAllPersonnel() {
        log.info("Petición recibida para obtener la lista de personal");
        List<PersonnelSummaryResponse> response = personnelService.getAllPersonnel();
        return ResponseEntity.ok(response);
    }

    // OBTENER PERSONAL POR ID (Detallado)
    @Operation(summary = "Obtener información completa de un usuario por ID", description = "Devuelve toda la información detallada del personal, exceptuando la contraseña.", responses = {
            @ApiResponse(responseCode = "200", description = "Información detallada obtenida exitosamente"),
            @ApiResponse(responseCode = "404", description = "No se encontró el personal con el ID proporcionado", content = @Content(schema = @Schema(implementation = com.navops.api.application.dto.response.ErrorResponseDto.class)))
    })
    @GetMapping("/user/{id}")
    public ResponseEntity<PersonnelDetailedResponse> getPersonnelById(@PathVariable("id") UUID id) {
        log.info("Petición recibida para buscar personal por ID: {}", id);
        PersonnelDetailedResponse response = personnelService.getPersonnelById(id);
        return ResponseEntity.ok(response);
    }

    // OBTENER PERSONAL PARA EDICIÓN
    @Operation(summary = "Obtener información estructurada de un usuario para edición", description = "Devuelve la información del personal estructurada en bloques para rellenar los formularios de edición.", responses = {
            @ApiResponse(responseCode = "200", description = "Información obtenida exitosamente"),
            @ApiResponse(responseCode = "404", description = "No se encontró el personal con el ID proporcionado", content = @Content(schema = @Schema(implementation = com.navops.api.application.dto.response.ErrorResponseDto.class)))
    })
    @GetMapping("/user/{id}/edit")
    public ResponseEntity<PersonnelEditResponse> getPersonnelForEdit(@PathVariable("id") UUID id) {
        log.info("Petición recibida para buscar personal para edición por ID: {}", id);
        PersonnelEditResponse response = personnelService.getPersonnelForEdit(id);
        return ResponseEntity.ok(response);
    }

    // UPDATE USER
    @Operation(summary = "Actualizar personal", description = "Actualiza los datos de un usuario existente.", responses = {
            @ApiResponse(responseCode = "200", description = "Personal actualizado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Error de validación de los datos enviados", content = @Content(schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "404", description = "Personal no encontrado", content = @Content(schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "409", description = "Conflicto por datos duplicados (Ej. DNI, Email, Legajo)", content = @Content(schema = @Schema(implementation = Map.class)))
    })
    @PutMapping("/user/{id}")
    public ResponseEntity<Map<String, String>> updatePersonnel(
            @PathVariable("id") UUID id,
            @RequestPart("data") @Valid UserUpdateRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        log.info("Recibida petición para actualizar personal ID: {}", id);
        try {
            personnelService.updatePersonnel(id, request, image);
            return ResponseEntity.ok(Map.of("message", "Personal actualizado exitosamente."));
        } catch (com.navops.api.infrastructure.exception.NoPersonnelFoundException e) {
            log.error("Personal no encontrado:", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (com.navops.api.infrastructure.exception.ResourceAlreadyExistsException e) {
            log.error("Conflicto al actualizar:", e);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            log.error("Argumento inválido:", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("ERROR AL ACTUALIZAR:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno: " + e.getMessage()));
        }
    }

    // UPDATE USER STATUS (LOGICAL DELETE)
    @Operation(summary = "Actualizar estado del personal (Baja Lógica)", description = "Actualiza el estado de una persona. Propaga los cambios a su usuario y tripulante asociado si corresponde.", responses = {
            @ApiResponse(responseCode = "200", description = "Estado actualizado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Error de validación del estado enviado", content = @Content(schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "404", description = "Personal no encontrado", content = @Content(schema = @Schema(implementation = Map.class)))
    })
    @PatchMapping("/user/{id}/status")
    public ResponseEntity<Map<String, String>> updatePersonnelStatus(
            @PathVariable("id") UUID id,
            @RequestBody @Valid StatusUpdateRequest request) {
        log.info("Recibida petición para actualizar estado del personal ID: {}", id);
        try {
            personnelService.updatePersonnelStatus(id, request);
            return ResponseEntity.ok(Map.of("message", "Estado del personal actualizado exitosamente."));
        } catch (com.navops.api.infrastructure.exception.NoPersonnelFoundException e) {
            log.error("Personal no encontrado:", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            log.error("Estado inválido:", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El estado provisto no es válido: " + e.getMessage()));
        } catch (Exception e) {
            log.error("ERROR AL ACTUALIZAR ESTADO:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno: " + e.getMessage()));
        }
    }
}
