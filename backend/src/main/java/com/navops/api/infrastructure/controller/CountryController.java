package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.response.CountryResponseDto;
import com.navops.api.application.dto.response.ErrorResponseDto;
import com.navops.api.application.service.CountryService;
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
@RequestMapping("/api/v1/admin")
@AllArgsConstructor
@Slf4j
@Tag(name = "Gestión de países", description = "Endpoints para la gestion de países")
public class CountryController {

    private final CountryService countryService;

    @Operation(
            summary = "Listar países para formularios",
            description = "Obtiene una lista de todos los países registrados (ID y Nombre) para llenar selectores en el frontend.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Lista obtenida exitosamente",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = CountryResponseDto.class))
                            )
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Error interno al recuperar los países",
                            content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))
                    )
            }
    )
    @GetMapping("/list-countries")
    public ResponseEntity<List<CountryResponseDto>> getCountriesForSelect() {
        log.info("Petición REST para obtener lista de países");

        List<CountryResponseDto> countries = countryService.getCountriesForSelect();

        return ResponseEntity.ok(countries);
    }
}
