package com.navops.api.repository;

import com.navops.api.domain.entity.TravelPlan;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TravelPlanRepository extends JpaRepository<TravelPlan, UUID> {

    @EntityGraph(attributePaths = {
            "ship", "originPort", "destinationPort",
            "stops", "stops.port",
            "crewMembers", "crewMembers.crewMember",
            "cargoItems"
    })
    Optional<TravelPlan> findByIdAndDeletedAtIsNull(UUID id);

    List<TravelPlan> findByShipIdAndDeletedAtIsNull(UUID shipId);

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
}
