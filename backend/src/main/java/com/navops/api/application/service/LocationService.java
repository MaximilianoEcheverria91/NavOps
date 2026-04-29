package com.navops.api.application.service;

import com.navops.api.application.dto.response.LocationResponseDto;
import com.navops.api.repository.CityRepository;
import com.navops.api.repository.ProvinceRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final ProvinceRepository provinceRepository;
    private final CityRepository cityRepository;

    public List<LocationResponseDto> getProvincesByCountry(UUID countryId) {
        return provinceRepository.findByCountryIdOrderByNameAsc(countryId)
                .stream()
                .map(p -> new LocationResponseDto(p.getId(), p.getName()))
                .collect(Collectors.toList());
    }

    public List<LocationResponseDto> getCitiesByProvince(UUID provinceId) {
        return cityRepository.findByProvinceIdOrderByNameAsc(provinceId)
                .stream()
                .map(c -> new LocationResponseDto(c.getId(), c.getName()))
                .collect(Collectors.toList());
    }
}
