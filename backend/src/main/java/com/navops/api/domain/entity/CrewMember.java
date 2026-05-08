package com.navops.api.domain.entity;

import com.navops.api.domain.enums.CrewMemberStatusEnum;
import com.navops.api.domain.enums.NavigationRoleEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "crew_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrewMember {

    @Id
    private UUID id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    private Person person;

    @Column(name = "file_number", nullable = false, unique = true, length = 50)
    private String fileNumber;

    @Column(name = "maritime_book_number", nullable = false, unique = true, length = 80)
    private String maritimeBookNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "navigation_role", nullable = false, length = 100)
    private NavigationRoleEnum navigationRole;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "current_status", nullable = false, length = 50)
    private CrewMemberStatusEnum status = CrewMemberStatusEnum.AVAILABLE;

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
