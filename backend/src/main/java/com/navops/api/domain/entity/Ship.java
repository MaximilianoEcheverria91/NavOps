package com.navops.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ship {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String registration;

    @Column(name = "imo_number", nullable = false, unique = true, length = 50)
    private String imoNumber;

    @Column(name = "ship_type", nullable = false, length = 80)
    private String shipType;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal length;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal beam;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal draft;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal depth;

    @Column(name = "weight_tonnes", nullable = false, precision = 10, scale = 2)
    private BigDecimal weightTonnes;

    @Column(name = "cargo_capacity_tonnes", nullable = false, precision = 10, scale = 2)
    private BigDecimal cargoCapacityTonnes;

    @Column(name = "crew_capacity", nullable = false)
    private Short crewCapacity;

    @Column(name = "build_year", nullable = false)
    private Short buildYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id")
    private Country country;

    @Column(name = "main_image_url", length = 1000)
    private String mainImageUrl;

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
