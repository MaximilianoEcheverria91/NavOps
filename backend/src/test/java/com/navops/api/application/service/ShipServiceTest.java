package com.navops.api.application.service;

import com.navops.api.application.dto.response.ship.ShipDetailResponse;
import com.navops.api.domain.entity.Engine;
import com.navops.api.domain.entity.Maintenance;
import com.navops.api.domain.entity.Ship;
import com.navops.api.domain.entity.ShipTank;
import com.navops.api.infrastructure.exception.ShipNotFoundException;
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
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShipServiceTest {

    @Mock private ShipRepository shipRepository;
    @Mock private EngineRepository engineRepository;
    @Mock private ShipTankRepository shipTankRepository;
    @Mock private MaintenanceRepository maintenanceRepository;

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
                .shipType("Mercantil")
                .length(new BigDecimal("41.56"))
                .beam(new BigDecimal("56.89"))
                .draft(new BigDecimal("56.45"))
                .depth(new BigDecimal("1.50"))
                .weightTonnes(new BigDecimal("8000"))
                .cargoCapacityTonnes(new BigDecimal("900"))
                .crewCapacity((short) 60)
                .buildYear((short) 1996)
                .build();
        when(shipRepository.findByIdAndDeletedAtIsNull(shipId)).thenReturn(Optional.of(ship));
    }

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
    @DisplayName("Maintenance IN_PROGRESS → status es MAINTENANCE")
    void getById_whenMaintenanceInProgress_returnsMaintenanceStatus() {
        Maintenance inProgress = Maintenance.builder()
                .id(UUID.randomUUID()).shipId(shipId).status("IN_PROGRESS").build();
        when(engineRepository.findFirstByShipIdAndDeletedAtIsNull(shipId)).thenReturn(Optional.empty());
        when(shipTankRepository.findAllByShipIdAndContentTypeAndDeletedAtIsNull(shipId, "FUEL")).thenReturn(List.of());
        when(maintenanceRepository.findAllByShipIdAndDeletedAtIsNull(shipId)).thenReturn(List.of(inProgress));

        ShipDetailResponse result = shipService.getById(shipId);

        assertEquals("MAINTENANCE", result.status());
    }

    @Test
    @DisplayName("Sin IN_PROGRESS → status es OPERATIONAL")
    void getById_whenNoInProgressMaintenance_returnsOperational() {
        Maintenance completed = Maintenance.builder()
                .id(UUID.randomUUID()).shipId(shipId).status("COMPLETED")
                .completedDate(LocalDate.of(2025, 3, 10)).build();
        when(engineRepository.findFirstByShipIdAndDeletedAtIsNull(shipId)).thenReturn(Optional.empty());
        when(shipTankRepository.findAllByShipIdAndContentTypeAndDeletedAtIsNull(shipId, "FUEL")).thenReturn(List.of());
        when(maintenanceRepository.findAllByShipIdAndDeletedAtIsNull(shipId)).thenReturn(List.of(completed));

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