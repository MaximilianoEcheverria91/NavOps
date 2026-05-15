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
    String hullNumber,
    Short holdCount,
    BigDecimal length,
    BigDecimal beam,
    BigDecimal draft,
    BigDecimal depth,
    Short crewCapacity,
    BigDecimal weightTonnes,
    BigDecimal cargoCapacityTonnes,
    String engineManufacturer,
    String engineModel,
    String engineSerialNumber,
    Integer currentEngineHours,
    Integer lastTboEngineHours,
    BigDecimal fuelCapacityLiters,
    LocalDate lastMaintenanceDate
) {}
