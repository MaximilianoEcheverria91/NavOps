package com.navops.api.repository;

import com.navops.api.domain.entity.TravelPlan;
import com.navops.api.domain.enums.TravelPlanStatusEnum;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TravelPlanRepository extends JpaRepository<TravelPlan, UUID>, JpaSpecificationExecutor<TravelPlan> {

    @EntityGraph(attributePaths = {
            "ship", "originPort", "destinationPort",
            "stops", "stops.port",
            "crewMembers", "crewMembers.crewMember",
            "cargoItems"
    })
    Optional<TravelPlan> findByIdAndDeletedAtIsNull(UUID id);

    List<TravelPlan> findByShipIdAndDeletedAtIsNull(UUID shipId);

    List<TravelPlan> findByStatusAndDeletedAtIsNull(TravelPlanStatusEnum status);

    Long countByStatusAndDeletedAtIsNull(TravelPlanStatusEnum status);

    @Query("SELECT COUNT(tp) FROM TravelPlan tp WHERE tp.deletedAt IS NULL")
    Long countAllNotDeleted();

    @Query("SELECT COUNT(tp) FROM TravelPlan tp WHERE tp.status IN (:statuses) AND tp.delayHours > 0 AND tp.deletedAt IS NULL")
    Long countDelayedByStatuses(@Param("statuses") List<TravelPlanStatusEnum> statuses);

    @Query("SELECT tp.status, COUNT(tp) FROM TravelPlan tp " +
           "JOIN tp.crewMembers tpc " +
           "JOIN tpc.crewMember cm " +
           "JOIN cm.person p " +
           "JOIN p.user u " +
           "WHERE u.id = :userId AND tp.deletedAt IS NULL " +
           "GROUP BY tp.status")
    List<Object[]> countByUserIdGroupByStatus(@Param("userId") UUID userId);

    @Query("SELECT tp FROM TravelPlan tp " +
           "JOIN tp.crewMembers cm " +
           "WHERE cm.crewMember.person.user.id = :userId " +
           "AND tp.status IN (:statuses) " +
           "AND tp.deletedAt IS NULL " +
           "ORDER BY tp.departureTime ASC")
    List<TravelPlan> findActiveByCrewMemberIdAndDeletedAtIsNull(@Param("userId") UUID userId,
                                                                @Param("statuses") List<String> statuses);

    @EntityGraph(attributePaths = {"ship", "originPort", "destinationPort", "stops"})
    @Query("SELECT tp FROM TravelPlan tp WHERE tp.status NOT IN (:excludedStatuses) AND tp.deletedAt IS NULL")
    List<TravelPlan> findActiveTravelPlans(@Param("excludedStatuses") List<TravelPlanStatusEnum> excludedStatuses);

    @Query("SELECT COUNT(tp) > 0 FROM TravelPlan tp " +
           "WHERE tp.ship.id = :shipId " +
           "AND tp.deletedAt IS NULL " +
           "AND tp.status <> com.navops.api.domain.enums.TravelPlanStatusEnum.COMPLETED " +
           "AND tp.status <> com.navops.api.domain.enums.TravelPlanStatusEnum.CANCELLED " +
           "AND :newDeparture < tp.eta " +
           "AND :newEta > tp.departureTime")
    boolean existsOverlappingPlan(
            @Param("shipId") UUID shipId,
            @Param("newDeparture") OffsetDateTime newDeparture,
            @Param("newEta") OffsetDateTime newEta);

    @Query("SELECT COUNT(tp) > 0 FROM TravelPlan tp " +
           "WHERE tp.ship.id = :shipId " +
           "AND tp.id <> :excludePlanId " +
           "AND tp.deletedAt IS NULL " +
           "AND tp.status <> com.navops.api.domain.enums.TravelPlanStatusEnum.COMPLETED " +
           "AND tp.status <> com.navops.api.domain.enums.TravelPlanStatusEnum.CANCELLED " +
           "AND :newDeparture < tp.eta " +
           "AND :newEta > tp.departureTime")
    boolean existsOverlappingPlanExcludingId(
            @Param("shipId") UUID shipId,
            @Param("excludePlanId") UUID excludePlanId,
            @Param("newDeparture") OffsetDateTime newDeparture,
            @Param("newEta") OffsetDateTime newEta);
}
