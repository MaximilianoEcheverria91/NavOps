package com.navops.api.domain.entity;

import com.navops.api.domain.enums.DocumentTypeEnum;
import com.navops.api.domain.enums.GenderEnum;
import com.navops.api.domain.enums.MaritalStatusEnum;
import com.navops.api.domain.enums.PeopleStatusEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "people")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(nullable = false, length = 150)
    private String surname;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 50)
    private DocumentTypeEnum documentType;

    @Column(name = "document_number", nullable = false, length = 60)
    private String documentNumber;

    @Column(length = 50)
    private String cuil;

    @Enumerated(EnumType.STRING)
    @Column(name = "marital_status", length = 50)
    private MaritalStatusEnum maritalStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GenderEnum gender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nationality_country_id")
    private Country nationalityCountry;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(length = 255)
    private String email;

    @Column(length = 50)
    private String mobile;

    @Column(name = "home_phone", length = 50)
    private String homePhone;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "province_id", nullable = false)
    private Province province;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @Column(name = "address_street", length = 200)
    private String addressStreet;

    @Column(name = "address_number", length = 20)
    private String addressNumber;

    @Column(name = "address_floor", length = 10)
    private String addressFloor;

    @Column(name = "address_department", length = 20)
    private String addressDepartment;

    @Column(name = "address_postal_code", length = 20)
    private String addressPostalCode;

    @Column(name = "avatar_url", length = 1000)
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    private PeopleStatusEnum status = PeopleStatusEnum.ACTIVE;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
    private CrewMember crewMember;

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
