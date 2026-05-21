package com.navops.api.repository;

import com.navops.api.domain.entity.NavigationCargo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NavigationCargoRepository extends JpaRepository<NavigationCargo, UUID> {
    List<NavigationCargo> findAllByNavigationPlanId(UUID navigationPlanId);
}
