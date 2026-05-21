package com.navops.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ship_tanks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipTank {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "ship_id", nullable = false)
    private UUID shipId;

    @Builder.Default
    @Column(name = "tank_name", nullable = false, length = 50)
    private String tankName = "PRINCIPAL";

    @Column(name = "content_type", nullable = false, length = 50)
    private String contentType;

    @Column(name = "max_capacity_liters", nullable = false, precision = 12, scale = 2)
    private BigDecimal maxCapacityLiters;

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
