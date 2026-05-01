package com.navops.api.application.service;

import com.navops.api.application.dto.request.port.PortCreateRequest;
import com.navops.api.application.dto.response.port.PortResponse;
import com.navops.api.application.dto.response.port.PortSummaryResponse;
import com.navops.api.domain.entity.City;
import com.navops.api.domain.entity.Country;
import com.navops.api.domain.entity.Port;
import com.navops.api.domain.entity.Province;
import com.navops.api.domain.enums.PortStatusEnum;
import com.navops.api.infrastructure.exception.NoPortsFoundException;
import com.navops.api.infrastructure.exception.PortAlreadyExistsException;
import com.navops.api.repository.CityRepository;
import com.navops.api.repository.CountryRepository;
import com.navops.api.repository.PortRepository;
import com.navops.api.repository.ProvinceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PortService {

    private final PortRepository portRepository;
    private final CountryRepository countryRepository;
    private final ProvinceRepository provinceRepository;
    private final CityRepository localityRepository;
    private final ImageStorageService imageStorageService;

    @Transactional
    public PortResponse createPort(PortCreateRequest request, MultipartFile image) throws IOException {
        log.info("Iniciando creación de puerto con código: {}", request.code());

        if (portRepository.existsByCode(request.code())) {
            log.warn("El puerto con código {} ya existe.", request.code());
            throw new PortAlreadyExistsException("El código de puerto ya se encuentra registrado.");
        }

        Country country = countryRepository.findById(request.countryId())
                .orElseThrow(() -> new IllegalArgumentException("El ID del país provisto no existe."));

        Province province = provinceRepository.findById(request.provinceId())
                .orElseThrow(() -> new IllegalArgumentException("Provincia no encontrada."));

        City city = localityRepository.findById(request.cityId())
                .orElseThrow(() -> new IllegalArgumentException("Ciudad no encontrada."));

        String mainImageUrl = null;
        if (image != null && !image.isEmpty()) {
            mainImageUrl = imageStorageService.uploadImage(image, "ports");
        }

        Port port = Port.builder()
                .name(request.name())
                .type(request.type())
                .code(request.code())
                .contactPhone(request.contactPhone())
                .contactEmail(request.contactEmail())
                .timezone(request.timezone())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .dockCount(request.dockCount())
                .maxLength(request.maxLength())
                .maxDraft(request.maxDraft())
                .country(country)
                .province(province)
                .city(city)
                .mainImageUrl(mainImageUrl)
                .status(PortStatusEnum.OPERATIONAL)
                .isActive(true)
                .build();

        Port savedPort = portRepository.save(port);
        log.info("Puerto registrado exitosamente con ID: {}", savedPort.getId());

        return new PortResponse(
                savedPort.getId(),
                savedPort.getName(),
                savedPort.getType(),
                savedPort.getCode(),
                savedPort.getContactPhone(),
                savedPort.getContactEmail(),
                savedPort.getTimezone(),
                savedPort.getLatitude(),
                savedPort.getLongitude(),
                savedPort.getDockCount(),
                savedPort.getMaxLength(),
                savedPort.getMaxDraft(),
                country.getName(),
                province.getName(),
                city.getName(),
                savedPort.getMainImageUrl(),
                savedPort.getStatus(),
                savedPort.getIsActive()
        );
    }

    @Transactional(readOnly = true)
    public List<PortSummaryResponse> getAllActivePorts() {
        log.info("Iniciando recuperación de listado de puertos activos.");
        List<Port> activePorts = portRepository.findAllByIsActiveTrue();
        
        if (activePorts.isEmpty()) {
            log.warn("No se encontraron puertos activos en el sistema.");
            throw new NoPortsFoundException("No se encontraron puertos activos registrados.");
        }

        List<PortSummaryResponse> responseList = activePorts.stream()
                .map(port -> new PortSummaryResponse(
                        port.getId(),
                        port.getMainImageUrl(), // Can be null, frontend handles this
                        port.getName(),
                        port.getCountry().getName(),
                        port.getProvince().getName(),
                        port.getCity().getName(),
                        port.getStatus().name(),
                        port.getIsActive()
                ))
                .toList();
        
        log.info("Listado recuperado exitosamente. Total puertos activos: {}", responseList.size());
        return responseList;
    }
}
