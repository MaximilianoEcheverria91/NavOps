package com.navops.api.application.service;

import com.navops.api.application.dto.response.CountryResponseDto;
import com.navops.api.infrastructure.exception.NoCountriesFoundException;
import com.navops.api.repository.CountryRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class CountryService {

    private final CountryRepository countryRepository;

    public List<CountryResponseDto> getCountriesForSelect() {
        log.info("Cargando lista de países (ID y Nombre) para el frontend");
        List<CountryResponseDto> countries = countryRepository.findAllCountryForSelect();

        if (countries.isEmpty()){
            log.warn("Se intentó cargar la lista de países pero la tabla está vacía");
            throw new NoCountriesFoundException("No se encontraron países cargados en el sistema.");
        }
        return countries;
    }
}
