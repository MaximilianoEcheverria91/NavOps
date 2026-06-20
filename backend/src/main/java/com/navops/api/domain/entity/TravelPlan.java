package com.navops.api.domain.entity;

import com.navops.api.domain.enums.TravelPlanStatusEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "travel_plan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ship_id", nullable = false)
    private Ship ship;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origin_port_id", nullable = false)
    private Port originPort;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_port_id", nullable = false)
    private Port destinationPort;

    @Column(name = "departure_time", nullable = false)
    private OffsetDateTime departureTime;

    @Column(nullable = false)
    private OffsetDateTime eta;

    @Column(name = "distance_miles", precision = 10, scale = 2)
    private BigDecimal distanceMiles;

    @Column(name = "estimated_hours", precision = 8, scale = 2)
    private BigDecimal estimatedHours;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TravelPlanStatusEnum status = TravelPlanStatusEnum.PLANNED;

    @Builder.Default
    @Column(name = "progress_percentage", precision = 5, scale = 2)
    private BigDecimal progressPercentage = BigDecimal.ZERO;

    @Column(name = "delay_hours", precision = 6, scale = 2)
    private BigDecimal delayHours;

    @Column(name = "total_cargo_tonnes", precision = 12, scale = 2)
    private BigDecimal totalCargoTonnes;

    @Column(name = "current_latitude", precision = 9, scale = 6)
    private BigDecimal currentLatitude;

    @Column(name = "current_longitude", precision = 9, scale = 6)
    private BigDecimal currentLongitude;

    @Builder.Default
    @Column(name = "current_engine_status", length = 50, nullable = false)
    private String currentEngineStatus = "OK";

    @Builder.Default
    @Column(name = "current_heading")
    private Integer currentHeading = 0;

    @Builder.Default
    @OneToMany(mappedBy = "travelPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Stop> stops = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "travelPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TravelPlanCrew> crewMembers = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "travelPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TravelPlanCargo> cargoItems = new HashSet<>();

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
