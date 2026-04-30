package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.response.LocationResponseDto;
import com.navops.api.application.service.CityService;
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
@RequestMapping("/api/v1/admin/")
@RequiredArgsConstructor
@Tag(name = "Gestión de ciudad", description = "Gestión de ciudad para operaciones crud")
public class CityController {

    private final CityService cityService;

    @Operation(summary = "Obtener ciudades por provincias")
    @ApiResponse(responseCode = "200", description = "Lista de ciudades recuperada con éxito")
    @GetMapping("/cities/{provinceId}")
    public ResponseEntity<List<LocationResponseDto>> getCities(@PathVariable UUID provinceId) {
        return ResponseEntity.ok(cityService.getCitiesByProvince(provinceId));
    }
}
