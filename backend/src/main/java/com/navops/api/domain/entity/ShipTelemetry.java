package com.navops.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ship_telemetry")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipTelemetry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private TravelPlan travelPlan;

    @Column(nullable = false, precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(name = "speed_knots", nullable = false, precision = 4, scale = 1)
    private BigDecimal speedKnots;

    @Column(nullable = false)
    private Integer heading;

    @Column(name = "weather_condition", length = 100)
    private String weatherCondition;

    @Column(name = "recorded_at", nullable = false)
    private OffsetDateTime recordedAt;

    @Version
    @Column(nullable = false)
    private Integer version;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
        if (recordedAt == null) {
            recordedAt = OffsetDateTime.now();
        }
        if (version == null) {
            version = 0;
        }
    }
}
