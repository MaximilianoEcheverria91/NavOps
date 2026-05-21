package com.navops.api.application.dto.request.ship;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

@Schema(description = "DTO para la actualización de un Barco existente")
public record ShipUpdateRequest(

    @NotBlank(message = "El nombre del barco es obligatorio")
    @Schema(description = "Nombre del barco", example = "ARA Almirante Brown")
    String name,

    @NotBlank(message = "El número IMO es obligatorio")
    @Schema(description = "Número IMO único", example = "AR-D10-1983")
    String imoNumber,

    @NotBlank(message = "La matrícula es obligatoria")
    @Schema(description = "Matrícula única del barco", example = "D-10")
    String registration,

    @NotBlank(message = "El tipo de barco es obligatorio")
    @Schema(description = "Tipo de barco", example = "DESTROYER")
    String shipType,

    @NotNull(message = "El año de construcción es obligatorio")
    @Schema(description = "Año de construcción", example = "1983")
    Short buildYear,

    @NotNull(message = "El país es obligatorio")
    @Schema(description = "ID del país de bandera")
    UUID countryId,

    @NotBlank(message = "El estado es obligatorio")
    @Schema(description = "Estado del barco", example = "OPERATIONAL",
            allowableValues = {"OPERATIONAL", "MAINTENANCE", "REPAIR", "OUT_OF_SERVICE", "IN_TRANSIT", "INACTIVE"})
    String status,

    @Schema(description = "Número de casco", example = "D-10")
    String hullNumber,

    @Schema(description = "Cantidad de bodegas", example = "2")
    Short holdCount,

    @NotNull(message = "La eslora es obligatoria")
    @Schema(description = "Eslora en metros", example = "125.9")
    BigDecimal length,

    @NotNull(message = "La manga es obligatoria")
    @Schema(description = "Manga en metros", example = "14.0")
    BigDecimal beam,

    @NotNull(message = "El calado es obligatorio")
    @Schema(description = "Calado en metros", example = "5.8")
    BigDecimal draft,

    @NotNull(message = "El puntal es obligatorio")
    @Schema(description = "Puntal en metros", example = "9.28")
    BigDecimal depth,

    @NotNull(message = "El peso es obligatorio")
    @Schema(description = "Peso en toneladas (desplazamiento)", example = "3600.0")
    BigDecimal weightTonnes,

    @NotNull(message = "La capacidad de tripulación es obligatoria")
    @Schema(description = "Capacidad de tripulación", example = "200")
    Short crewCapacity,

    @NotNull(message = "La capacidad de carga es obligatoria")
    @Schema(description = "Capacidad de carga en toneladas", example = "0.0")
    BigDecimal cargoCapacityTonnes,

    @Schema(description = "Fabricante del motor", example = "Rolls-Royce")
    String engineManufacturer,

    @Schema(description = "Modelo del motor", example = "Olympus TM3B")
    String engineModel,

    @Schema(description = "Tipo de motor", example = "GAS_TURBINE")
    String engineType,

    @Schema(description = "Potencia en HP", example = "28000")
    Integer powerHp,

    @Schema(description = "Número de serie del motor", example = "SN-12345")
    String serialNumber,

    @Schema(description = "Horas del motor en el último overhaul", example = "10000")
    Integer lastTboEngineHours,

    @Schema(description = "Nombre del tanque", example = "PRINCIPAL")
    String tankName,

    @Schema(description = "Tipo de contenido del tanque", example = "FUEL")
    String contentType,

    @Schema(description = "Capacidad máxima del tanque en litros", example = "500000.0")
    BigDecimal fuelCapacityLiters

) {}
