package com.navops.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "maintenance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "ship_id", nullable = false)
    private UUID shipId;

    @Builder.Default
    @Column(name = "maintenance_type", nullable = false, length = 50)
    private String maintenanceType = "GENERAL";

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Column(name = "completed_date")
    private LocalDate completedDate;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;
}
