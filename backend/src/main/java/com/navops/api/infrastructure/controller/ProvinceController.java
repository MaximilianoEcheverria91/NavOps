package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.response.LocationResponseDto;
import com.navops.api.application.service.ProvinceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Gestión de Provincia ", description = "Gestión de entidad provincia para operaciones crud")
public class ProvinceController {

    private final ProvinceService provinceService;

    @Operation(summary = "Obtener provincias por país")
    @ApiResponse(responseCode = "200", description = "Lista de provincias recuperada con éxito")
    @GetMapping("/provinces/{countryId}")
    public ResponseEntity<List<LocationResponseDto>> getProvinces(@PathVariable UUID countryId) {
        return ResponseEntity.ok(provinceService.getProvincesByCountry(countryId));
    }
}
