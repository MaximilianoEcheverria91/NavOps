package com.navops.api.application.service;

import com.navops.api.application.dto.response.LocationResponseDto;
import com.navops.api.infrastructure.exception.NoProvincesFoundException;
import com.navops.api.repository.ProvinceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProvinceService {

    private final ProvinceRepository provinceRepository;

    public List<LocationResponseDto> getProvincesByCountry(UUID countryId) {
        List<LocationResponseDto> provinces = provinceRepository.findByCountryIdOrderByNameAsc(countryId)
                .stream()
                .map(p -> new LocationResponseDto(p.getId(), p.getName()))
                .collect(Collectors.toList());

        if (provinces.isEmpty()) {
            throw new NoProvincesFoundException("No provinces found for the given country ID");
        }

        return provinces;
    }
}
