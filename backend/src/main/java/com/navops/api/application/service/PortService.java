package com.navops.api.application.service;

import com.navops.api.application.dto.request.port.PortCreateRequest;
import com.navops.api.application.dto.request.port.PortUpdateRequest;
import com.navops.api.application.dto.response.port.PortDetailedResponse;
import com.navops.api.application.dto.response.port.PortResponse;
import com.navops.api.application.dto.response.port.PortSummaryResponse;
import com.navops.api.domain.entity.City;
import com.navops.api.domain.entity.Country;
import com.navops.api.domain.entity.Port;
import com.navops.api.domain.entity.Province;
import com.navops.api.domain.enums.DockTypeEnum;
import com.navops.api.domain.enums.PortStatusEnum;
import com.navops.api.domain.enums.TypePortEnum;
import com.navops.api.infrastructure.exception.NoPortsFoundException;
import com.navops.api.infrastructure.exception.PortAlreadyExistsException;
import com.navops.api.infrastructure.exception.PortNotFoundException;
import com.navops.api.repository.CityRepository;
import com.navops.api.repository.CountryRepository;
import com.navops.api.repository.PortRepository;
import com.navops.api.repository.ProvinceRepository;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

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
                .portType(TypePortEnum.valueOf(request.portType().toUpperCase()))
                .dockType(DockTypeEnum.valueOf(request.dockType().toUpperCase()))
                .code(request.code())
                .contactPhone(request.contactPhone())
                .contactEmail(request.contactEmail())
                .contactWeb(request.contactWeb())
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
                savedPort.getPortType().name(),
                savedPort.getDockType().name(),
                savedPort.getCode(),
                savedPort.getContactPhone(),
                savedPort.getContactEmail(),
                savedPort.getContactWeb(),
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

    // LISTA DE PUERTOS
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
                        port.getCode(),
                        port.getCountry().getName(),
                        port.getProvince().getName(),
                        port.getCity().getName(),
                        port.getStatus().name(),
                        port.getIsActive(),
                        port.getLatitude(),
                        port.getLongitude()
                ))
                .toList();
        
        log.info("Listado recuperado exitosamente. Total puertos activos: {}", responseList.size());
        return responseList;
    }

    // DELETE PORT

    @Transactional
    public void deactivatePort(UUID id) {
        log.info("Desactivando puerto con ID: {}", id);

        Port port = portRepository.findById(id)
                .orElseThrow(() -> new PortNotFoundException("No se encontró el puerto con el ID proporcionado."));

        port.setStatus(PortStatusEnum.INACTIVE);
        port.setIsActive(false);
        port.setDeletedAt(OffsetDateTime.now());

        //Port savedPort = portRepository.save(port);
        // No hace falta el .save() si el objeto es administrado por la transacción
        log.info("Puerto con ID {} marcado como inactivo.", id);
    }



    // UPDATE PORT

    @Transactional
    public void updatePort(UUID id, PortUpdateRequest request, MultipartFile image) throws IOException {
        log.info("Actualizando puerto con ID: {}", id);

        Port port = portRepository.findById(id)
                .orElseThrow(() -> new PortNotFoundException("No se encontró el puerto con el ID proporcionado."));

        if (!port.getCode().equals(request.code()) && portRepository.existsByCodeAndIdNot(request.code(), id)) {
            log.warn("El código {} ya está registrado por otro puerto.", request.code());
            throw new PortAlreadyExistsException("El código de puerto ya se encuentra registrado por otro puerto.");
        }

        Country country = countryRepository.findById(request.countryId())
                .orElseThrow(() -> new IllegalArgumentException("El ID del país provisto no existe."));

        Province province = provinceRepository.findById(request.provinceId())
                .orElseThrow(() -> new IllegalArgumentException("Provincia no encontrada."));

        City city = localityRepository.findById(request.cityId())
                .orElseThrow(() -> new IllegalArgumentException("Ciudad no encontrada."));

        if (image != null && !image.isEmpty()) {
            String imageUrl = imageStorageService.uploadImage(image, "ports");
            port.setMainImageUrl(imageUrl);
        }

        port.setName(request.name());
        port.setPortType(TypePortEnum.valueOf(request.portType().toUpperCase()));
        port.setDockType(DockTypeEnum.valueOf(request.dockType().toUpperCase()));
        port.setCode(request.code());
        port.setContactPhone(request.contactPhone());
        port.setContactEmail(request.contactEmail());
        port.setContactWeb(request.contactWeb());
        port.setTimezone(request.timezone());
        port.setLatitude(request.latitude());
        port.setLongitude(request.longitude());
        port.setDockCount(request.dockCount());
        port.setMaxLength(request.maxLength());
        port.setMaxDraft(request.maxDraft());
        port.setCountry(country);
        port.setProvince(province);
        port.setCity(city);
        port.setStatus(PortStatusEnum.valueOf(request.status().toUpperCase()));

        log.info("Puerto con ID {} actualizado exitosamente.", id);
    }

    // REACTIVATE PORT

    @Transactional
    public void reactivatePort(UUID id) {
        log.info("Reactivando puerto con ID: {}", id);

        Port port = portRepository.findById(id)
                .orElseThrow(() -> new PortNotFoundException("No se encontró el puerto con el ID proporcionado."));

        port.setStatus(PortStatusEnum.OPERATIONAL);
        port.setIsActive(true);
        port.setDeletedAt(null);

        log.info("Puerto con ID {} reactivado exitosamente.", id);
    }

    // DETAIL PORT
    @Transactional(readOnly = true)
    public PortDetailedResponse getPortById(UUID id){
        log.info("Buscando puerto con el detalla en ID: {}", id);
        Port port = portRepository.findById(id)
                .orElseThrow(
                        () -> new NoPortsFoundException("No se encontró el personal con el ID proporcionado."));
        return mapToPortDetail(port);
    }



    public PortDetailedResponse mapToPortDetail(Port port){

        return new PortDetailedResponse(
                port.getId(),
                port.getName(),
                port.getCode(),
                port.getPortType() != null ? port.getPortType().name() : null,
                port.getDockType() != null ? port.getDockType().name() : null,
                port.getLatitude(),
                port.getLongitude(),
                port.getDockCount(),
                port.getMaxLength(),
                port.getMaxDraft(),
                port.getCountry() != null ? port.getCountry().getId() : null,
                port.getCountry() != null ? port.getCountry().getName() : null,
                port.getProvince() != null ? port.getProvince().getId() : null,
                port.getProvince() != null ? port.getProvince().getName() : null,
                port.getCity() != null ? port.getCity().getId() : null,
                port.getCity() != null ? port.getCity().getName() : null,
                port.getMainImageUrl(),
                port.getContactPhone(),
                port.getContactEmail(),
                port.getContactWeb(),
                port.getTimezone(),
                port.getStatus() != null ? port.getStatus().name() : null,
                port.getIsActive());

    }
}
