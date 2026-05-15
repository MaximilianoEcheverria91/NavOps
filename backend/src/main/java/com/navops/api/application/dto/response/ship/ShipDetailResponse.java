package com.navops.api.application.dto.response.ship;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Schema(description = "DTO completo para el modal de detalle del barco")
public record ShipDetailResponse(
    UUID id,
    String name,
    String registration,
    String imoNumber,
    String shipType,
    Integer buildYear,
    String countryName,
    String status,
    String mainImageUrl,
    // Gap 2 — ships.hull_number?
    String hullNumber,
    // Gap 3   ships.hold_count?
    Short holdCount,
    // Especificaciones físicas — presentes en ships
    BigDecimal length,
    BigDecimal beam,
    BigDecimal draft,
    BigDecimal depth,
    // Capacidades — presentes en ships
    Short crewCapacity,
    BigDecimal cargoCapacityTonnes,
    // Relacionadas - null por ahora
    String engineModel,
    // Gap 4 — engines.serial_number?
    String engineSerialNumber,
    Integer currentEngineHours,
    // Gap 5 — tbo.last_tbo_engine_hours?
    Integer lastTboEngineHours,
    BigDecimal fuelCapacityLiters,
    LocalDate lastMaintenanceDate
) {}