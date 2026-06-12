package com.navops.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "engines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Engine {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "ship_id", nullable = false)
    private UUID shipId;

    @Column(nullable = false, length = 100)
    private String manufacturer;

    @Column(nullable = false, length = 100)
    private String model;

    @Builder.Default
    @Column(name = "engine_type", nullable = false, length = 50)
    private String engineType = "UNKNOWN";

    @Builder.Default
    @Column(name = "power_hp", nullable = false)
    private Integer powerHp = 0;

    @Column(name = "current_engine_hours", nullable = false)
    private Integer currentEngineHours;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(name = "last_tbo_engine_hours")
    private Integer lastTboEngineHours;

    @Builder.Default
    @Column(name = "fuel_consumption_liters_per_hour", precision = 8, scale = 2, nullable = false)
    private BigDecimal fuelConsumptionLitersPerHour = new BigDecimal("250.00");

    @Builder.Default
    @Version
    @Column(nullable = false)
    private Integer version = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;
}
