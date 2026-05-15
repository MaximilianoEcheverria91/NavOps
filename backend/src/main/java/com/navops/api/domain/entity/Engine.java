package com.navops.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "current_engine_hours", nullable = false)
    private Integer currentEngineHours;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(name = "last_tbo_engine_hours")
    private Integer lastTboEngineHours;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;
}
