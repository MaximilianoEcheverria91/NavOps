package com.navops.api.domain.entity;

import com.navops.api.domain.enums.travelPlanCargo.CargoStatusEnum;
import com.navops.api.domain.enums.travelPlanCargo.CargoTypeEnum;
import com.navops.api.domain.enums.travelPlanCargo.ContainerTypeEnum;
import com.navops.api.domain.enums.travelPlanCargo.ProductCategoryEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "travel_plan_cargo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelPlanCargo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private TravelPlan travelPlan;

    @Column(name = "product_name", nullable = false, length = 150)
    private String productName;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_category", nullable = false, length = 80)
    private ProductCategoryEnum productCategory;

    @Column(name = "product_type", nullable = false, length = 80)
    private String productType;

    @Enumerated(EnumType.STRING)
    @Column(name = "cargo_type", nullable = false, length = 50)
    private CargoTypeEnum cargoType;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "weight_tonnes", nullable = false, precision = 10, scale = 2)
    private BigDecimal weightTonnes;

    @Column(name = "volume_m3", nullable = false, precision = 10, scale = 2)
    private BigDecimal volumeM3;

    @Column(name = "owning_company", nullable = false, length = 200)
    private String owningCompany;

    @Enumerated(EnumType.STRING)
    @Column(name = "container_type", length = 80)
    private ContainerTypeEnum containerType;

    @Column(name = "hazardous_material", nullable = false)
    private boolean hazardousMaterial;

    @Column(columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 80)
    private CargoStatusEnum status;

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
