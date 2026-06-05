package com.navops.api.repository;

import com.navops.api.domain.entity.TravelPlanCrew;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TravelPlanCrewRepository extends JpaRepository<TravelPlanCrew, UUID> {

    List<TravelPlanCrew> findByTravelPlanIdAndDeletedAtIsNull(UUID planId);
}
