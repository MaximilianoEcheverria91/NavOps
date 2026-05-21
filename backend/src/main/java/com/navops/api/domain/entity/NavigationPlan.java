package com.navops.api.domain.entity;

import com.navops.api.domain.enums.NavigationPlanStatusEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "navigation_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NavigationPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String name;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private NavigationPlanStatusEnum status = NavigationPlanStatusEnum.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ship_id")
    private Ship ship;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "route_id")
    private NavigationRoute route;

    @Builder.Default
    @OneToMany(mappedBy = "navigationPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NavigationCargo> cargoList = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "navigationPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlanCrewAssignment> crewAssignments = new ArrayList<>();

    @Column(length = 1000)
    private String notes;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;

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
}
