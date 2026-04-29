package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.response.LocationResponseDto;
import com.navops.api.application.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/provinces/{countryId}")
    public ResponseEntity<List<LocationResponseDto>> getProvinces(@PathVariable UUID countryId) {
        return ResponseEntity.ok(locationService.getProvincesByCountry(countryId));
    }

    @GetMapping("/cities/{provinceId}")
    public ResponseEntity<List<LocationResponseDto>> getCities(@PathVariable UUID provinceId) {
        return ResponseEntity.ok(locationService.getCitiesByProvince(provinceId));
    }
}
