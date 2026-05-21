package com.navops.api.repository;

import com.navops.api.domain.entity.NavigationPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NavigationPlanRepository extends JpaRepository<NavigationPlan, UUID> {
    List<NavigationPlan> findAllByDeletedAtIsNull();
    Optional<NavigationPlan> findByIdAndDeletedAtIsNull(UUID id);
}
