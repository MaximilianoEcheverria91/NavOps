package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.request.PersonnelRegistrationRequest;
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

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Personnel Management", description = "Endpoints para la gestión de personal, tripulación y usuarios")
public class PersonnelController {

    private  final  PersonnelService personnelService;


    @Operation(
            summary = "Registrar nuevo personal",
            description = "Crea un registro de persona, tripulante y opcionalmente un usuario del sistema.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Personal registrado exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Error de validación de los datos enviados", content = @Content(schema = @Schema(implementation = Map.class))),
                    @ApiResponse(responseCode = "409", description = "Conflicto por datos duplicados (Ej. DNI o Email)", content = @Content(schema = @Schema(implementation = Map.class)))
            }
    )
    @PostMapping("/create-user")
    public ResponseEntity<Map<String, String>> registerPersonnel(
            @RequestPart("data") @Valid PersonnelRegistrationRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        log.info("Recibida petición para registrar personal documento: {}", request.generalInfo().documentNumber());
        try {
            personnelService.registerPersonnel(request, image);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Personal registrado exitosamente."));
        } catch (Exception e) {
            log.error("ERROR AL REGISTRAR:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno: " + e.getMessage()));
        }
    }
}

     /*   @PostMapping("/create-user")
        public ResponseEntity<Map<String, String>> registerPersonnel(
                @RequestPart("data") @Valid PersonnelRegistrationRequest request
        ) {
            log.info("Recibida petición para registrar personal documento: {}", request.generalInfo().documentNumber());
            try {
                // LLAMADA AL SERVICIO (Sin la imagen por ahora)

                personnelService.registerPersonnel(request, null);

                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(Map.of("message", "Personal registrado exitosamente."));
            } catch (Exception e) {
                log.error("ERROR AL REGISTRAR:", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Error interno: " + e.getMessage()));
            }*/
