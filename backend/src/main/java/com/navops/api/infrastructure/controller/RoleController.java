package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.response.ErrorResponseDto;
import com.navops.api.application.dto.response.RoleResponseDto;
import com.navops.api.application.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@Slf4j
@AllArgsConstructor
@RequestMapping("/api/v1/admin")
@Tag(name = "Gestión de roles", description = "Endpoints para la gestion de roles")
public class RoleController {

    private final RoleService roleService;

    @Operation(
            summary = "Listar roles para formularios",
            description = "Obtiene una lista de todos los roles registrados (ID y Nombre) para llenar selectores en el frontend.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Lista obtenida exitosamente",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = RoleResponseDto.class))
                            )
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Error interno al recuperar los países",
                            content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))
                    )
            }
    )
    @GetMapping("/list-roles")
    public ResponseEntity<List<RoleResponseDto>> getRoleForSelect() {
        log.info("Petición REST para obtener lista de roles");

        List<RoleResponseDto> role = roleService.getRoleForSelect();

        return ResponseEntity.ok(role);
    }
}
