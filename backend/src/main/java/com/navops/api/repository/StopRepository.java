package com.navops.api.repository;

import com.navops.api.domain.entity.Stop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StopRepository extends JpaRepository<Stop, UUID> {

    List<Stop> findByTravelPlanIdAndDeletedAtIsNullOrderBySequenceAsc(UUID planId);
}
