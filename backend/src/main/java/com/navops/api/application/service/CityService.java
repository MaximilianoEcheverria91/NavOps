package com.navops.api.application.service;

import com.navops.api.application.dto.response.LocationResponseDto;
import com.navops.api.infrastructure.exception.NoCitiesFoundException;
import com.navops.api.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CityService {

    private final CityRepository cityRepository;

    public List<LocationResponseDto> getCitiesByProvince(UUID provinceId) {
        List<LocationResponseDto> cities = cityRepository.findByProvinceIdOrderByNameAsc(provinceId)
                .stream()
                .map(c -> new LocationResponseDto(c.getId(), c.getName()))
                .collect(Collectors.toList());

        if (cities.isEmpty()) {
            throw new NoCitiesFoundException("No cities found for the given province ID");
        }

        return cities;
    }
}
