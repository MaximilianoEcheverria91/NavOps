package com.navops.api.repository;

import com.navops.api.domain.entity.TankReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TankReadingRepository extends JpaRepository<TankReading, UUID> {

    Optional<TankReading> findTopByTankIdAndTravelPlanIdOrderByRecordedAtDesc(UUID tankId, UUID planId);
}
