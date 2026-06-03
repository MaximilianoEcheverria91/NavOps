package com.navops.api.repository;

import com.navops.api.domain.entity.TravelPlanCargo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TravelPlanCargoRepository extends JpaRepository<TravelPlanCargo, UUID> {

    List<TravelPlanCargo> findByPlanIdAndDeletedAtIsNull(UUID planId);
}
