package com.navops.api.application.service;

import com.navops.api.application.dto.request.ship.ShipCreateRequest;
import com.navops.api.application.dto.response.ship.ShipDetailResponse;
import com.navops.api.domain.entity.Country;
import com.navops.api.domain.entity.Engine;
import com.navops.api.domain.entity.Maintenance;
import com.navops.api.domain.entity.Ship;
import com.navops.api.domain.entity.ShipTank;
import com.navops.api.domain.enums.ShipStatusEnum;
import com.navops.api.domain.enums.ShipTypeEnum;
import com.navops.api.infrastructure.exception.ShipAlreadyExistsException;
import com.navops.api.infrastructure.exception.ShipNotFoundException;
import com.navops.api.repository.CountryRepository;
import com.navops.api.repository.EngineRepository;
import com.navops.api.repository.MaintenanceRepository;
import com.navops.api.repository.ShipRepository;
import com.navops.api.repository.ShipTankRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito; // 🔥 Importamos Mockito nativo para usar lenient
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShipServiceTest {

    @Mock private ShipRepository shipRepository;
    @Mock private EngineRepository engineRepository;
    @Mock private ShipTankRepository shipTankRepository;
    @Mock private MaintenanceRepository maintenanceRepository;
    @Mock private CountryRepository countryRepository;
    @Mock private ImageStorageService imageStorageService;

    @InjectMocks private ShipService shipService;

    private UUID shipId;
    private Ship ship;

    @BeforeEach
    void setUp() {
        shipId = UUID.randomUUID();
        ship = Ship.builder()
                .id(shipId)
                .name("Libertador")
                .registration("2-SE-2-158-97")
                .imoNumber("9176187")
                .shipType(ShipTypeEnum.CONTAINER_SHIP)
                .length(new BigDecimal("41.56"))
                .beam(new BigDecimal("56.89"))
                .draft(new BigDecimal("56.45"))
                .depth(new BigDecimal("1.50"))
                .weightTonnes(new BigDecimal("8000"))
                .cargoCapacityTonnes(new BigDecimal("900"))
                .crewCapacity((short) 60)
                .buildYear((short) 1996)
                .build();

        // 🔥 SOLUCIÓN: Envolvemos el stubbing con Mockito.lenient() para evitar que falle en los tests de creación
        Mockito.lenient().when(shipRepository.findByIdAndDeletedAtIsNull(shipId)).thenReturn(Optional.of(ship));
    }

    // ── createShip ────────────────────────────────────────────────────────────

    private ShipCreateRequest minimalRequest(UUID countryId) {
        return new ShipCreateRequest(
                "ARA Almirante Brown", "AR-D10-1983", "D-10", ShipTypeEnum.CONTAINER_SHIP.name(), (short) 1983,
                countryId, "OPERATIONAL", null,
                new BigDecimal("125.9"), new BigDecimal("14.0"), new BigDecimal("5.8"), new BigDecimal("9.28"),
                new BigDecimal("3600"), (short) 200, BigDecimal.ZERO,
                null, null, null, null, null, null, null, null
        );
    }

    @Test
    @DisplayName("IMO duplicado → ShipAlreadyExistsException")
    void createShip_whenDuplicateImo_throwsException() {
        when(shipRepository.existsByImoNumberAndDeletedAtIsNull("AR-D10-1983")).thenReturn(true);

        assertThrows(ShipAlreadyExistsException.class,
                () -> shipService.createShip(minimalRequest(UUID.randomUUID()), null));
    }

    @Test
    @DisplayName("Matrícula duplicada → ShipAlreadyExistsException")
    void createShip_whenDuplicateRegistration_throwsException() {
        when(shipRepository.existsByImoNumberAndDeletedAtIsNull("AR-D10-1983")).thenReturn(false);
        when(shipRepository.existsByRegistrationAndDeletedAtIsNull("D-10")).thenReturn(true);

        assertThrows(ShipAlreadyExistsException.class,
                () -> shipService.createShip(minimalRequest(UUID.randomUUID()), null));
    }

    @Test
    @DisplayName("País inexistente → IllegalArgumentException")
    void createShip_whenCountryNotFound_throwsException() {
        UUID unknownCountryId = UUID.randomUUID();
        when(shipRepository.existsByImoNumberAndDeletedAtIsNull("AR-D10-1983")).thenReturn(false);
        when(shipRepository.existsByRegistrationAndDeletedAtIsNull("D-10")).thenReturn(false);
        when(countryRepository.findById(unknownCountryId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> shipService.createShip(minimalRequest(unknownCountryId), null));
    }

    @Test
    @DisplayName("Happy path → barco creado, ShipDetailResponse retornado")
    void createShip_happyPath_returnsDetailResponse() throws Exception {
        UUID countryId = UUID.randomUUID();
        Country country = Country.builder().id(countryId).name("Argentina").isoCode("AR").version(0).build();

        when(shipRepository.existsByImoNumberAndDeletedAtIsNull("AR-D10-1983")).thenReturn(false);
        when(shipRepository.existsByRegistrationAndDeletedAtIsNull("D-10")).thenReturn(false);
        when(countryRepository.findById(countryId)).thenReturn(Optional.of(country));
        when(shipRepository.save(any(Ship.class))).thenAnswer(inv -> inv.getArgument(0));

        ShipDetailResponse result = shipService.createShip(minimalRequest(countryId), null);

        assertNotNull(result);
        assertEquals("ARA Almirante Brown", result.name());
        assertEquals("AR-D10-1983", result.imoNumber());
        assertEquals("OPERATIONAL", result.status());
    }

    // ── getById ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Motor encontrado → engineModel y currentEngineHours se rellenan")
    void getById_whenEngineExists_returnsEngineFields() {
        Engine engine = Engine.builder()
                .id(UUID.randomUUID()).shipId(shipId)
                .manufacturer("MAN B&W").model("6S50MC").currentEngineHours(8200)
                .build();
        when(engineRepository.findFirstByShipIdAndDeletedAtIsNull(shipId)).thenReturn(Optional.of(engine));
        when(shipTankRepository.findAllByShipIdAndContentTypeAndDeletedAtIsNull(shipId, "FUEL")).thenReturn(List.of());
        when(maintenanceRepository.findAllByShipIdAndDeletedAtIsNull(shipId)).thenReturn(List.of());

        ShipDetailResponse result = shipService.getById(shipId);

        assertEquals("6S50MC", result.engineModel());
        assertEquals(8200, result.currentEngineHours());
    }

    @Test
    @DisplayName("Sin motor → engineModel y currentEngineHours son null")
    void getById_whenNoEngine_returnsNullEngineFields() {
        when(engineRepository.findFirstByShipIdAndDeletedAtIsNull(shipId)).thenReturn(Optional.empty());
        when(shipTankRepository.findAllByShipIdAndContentTypeAndDeletedAtIsNull(shipId, "FUEL")).thenReturn(List.of());
        when(maintenanceRepository.findAllByShipIdAndDeletedAtIsNull(shipId)).thenReturn(List.of());

        ShipDetailResponse result = shipService.getById(shipId);

        assertNull(result.engineModel());
        assertNull(result.currentEngineHours());
    }

    @Test
    @DisplayName("Tanques de combustible → fuelCapacityLiters es la suma")
    void getById_whenFuelTanksExist_returnsSummedCapacity() {
        ShipTank tank1 = ShipTank.builder()
                .id(UUID.randomUUID()).shipId(shipId).contentType("FUEL")
                .maxCapacityLiters(new BigDecimal("30000.00")).build();
        ShipTank tank2 = ShipTank.builder()
                .id(UUID.randomUUID()).shipId(shipId).contentType("FUEL")
                .maxCapacityLiters(new BigDecimal("15000.00")).build();
        when(engineRepository.findFirstByShipIdAndDeletedAtIsNull(shipId)).thenReturn(Optional.empty());
        when(shipTankRepository.findAllByShipIdAndContentTypeAndDeletedAtIsNull(shipId, "FUEL")).thenReturn(List.of(tank1, tank2));
        when(maintenanceRepository.findAllByShipIdAndDeletedAtIsNull(shipId)).thenReturn(List.of());

        ShipDetailResponse result = shipService.getById(shipId);

        assertEquals(new BigDecimal("45000.00"), result.fuelCapacityLiters());
    }

    @Test
    @DisplayName("Sin tanques → fuelCapacityLiters es null")
    void getById_whenNoFuelTanks_returnsFuelNull() {
        when(engineRepository.findFirstByShipIdAndDeletedAtIsNull(shipId)).thenReturn(Optional.empty());
        when(shipTankRepository.findAllByShipIdAndContentTypeAndDeletedAtIsNull(shipId, "FUEL")).thenReturn(List.of());
        when(maintenanceRepository.findAllByShipIdAndDeletedAtIsNull(shipId)).thenReturn(List.of());

        ShipDetailResponse result = shipService.getById(shipId);

        assertNull(result.fuelCapacityLiters());
    }

    @Test
    @DisplayName("Barco con status MAINTENANCE → getById devuelve MAINTENANCE")
    void getById_whenShipStatusIsMaintenance_returnsMaintenance() {
        ship.setStatus(ShipStatusEnum.MAINTENANCE);
        when(engineRepository.findFirstByShipIdAndDeletedAtIsNull(shipId)).thenReturn(Optional.empty());
        when(shipTankRepository.findAllByShipIdAndContentTypeAndDeletedAtIsNull(shipId, "FUEL")).thenReturn(List.of());
        when(maintenanceRepository.findAllByShipIdAndDeletedAtIsNull(shipId)).thenReturn(List.of());

        ShipDetailResponse result = shipService.getById(shipId);

        assertEquals("MAINTENANCE", result.status());
    }

    @Test
    @DisplayName("Barco con status OPERATIONAL → getById devuelve OPERATIONAL")
    void getById_whenShipStatusIsOperational_returnsOperational() {
        when(engineRepository.findFirstByShipIdAndDeletedAtIsNull(shipId)).thenReturn(Optional.empty());
        when(shipTankRepository.findAllByShipIdAndContentTypeAndDeletedAtIsNull(shipId, "FUEL")).thenReturn(List.of());
        when(maintenanceRepository.findAllByShipIdAndDeletedAtIsNull(shipId)).thenReturn(List.of());

        ShipDetailResponse result = shipService.getById(shipId);

        assertEquals("OPERATIONAL", result.status());
    }

    @Test
    @DisplayName("Múltiples COMPLETED → lastMaintenanceDate es la más reciente")
    void getById_whenMultipleCompleted_returnsLatestDate() {
        Maintenance older = Maintenance.builder()
                .id(UUID.randomUUID()).shipId(shipId).status("COMPLETED")
                .completedDate(LocalDate.of(2024, 6, 1)).build();
        Maintenance newer = Maintenance.builder()
                .id(UUID.randomUUID()).shipId(shipId).status("COMPLETED")
                .completedDate(LocalDate.of(2025, 3, 10)).build();
        when(engineRepository.findFirstByShipIdAndDeletedAtIsNull(shipId)).thenReturn(Optional.empty());
        when(shipTankRepository.findAllByShipIdAndContentTypeAndDeletedAtIsNull(shipId, "FUEL")).thenReturn(List.of());
        when(maintenanceRepository.findAllByShipIdAndDeletedAtIsNull(shipId)).thenReturn(List.of(older, newer));

        ShipDetailResponse result = shipService.getById(shipId);

        assertEquals(LocalDate.of(2025, 3, 10), result.lastMaintenanceDate());
    }

    @Test
    @DisplayName("Sin mantenimientos → lastMaintenanceDate es null")
    void getById_whenNoMaintenance_returnsNullDate() {
        when(engineRepository.findFirstByShipIdAndDeletedAtIsNull(shipId)).thenReturn(Optional.empty());
        when(shipTankRepository.findAllByShipIdAndContentTypeAndDeletedAtIsNull(shipId, "FUEL")).thenReturn(List.of());
        when(maintenanceRepository.findAllByShipIdAndDeletedAtIsNull(shipId)).thenReturn(List.of());

        ShipDetailResponse result = shipService.getById(shipId);

        assertNull(result.lastMaintenanceDate());
    }

    @Test
    @DisplayName("ID inexistente → ShipNotFoundException")
    void getById_whenShipNotFound_throwsException() {
        UUID unknown = UUID.randomUUID();
        when(shipRepository.findByIdAndDeletedAtIsNull(unknown)).thenReturn(Optional.empty());

        assertThrows(ShipNotFoundException.class, () -> shipService.getById(unknown));
    }
}