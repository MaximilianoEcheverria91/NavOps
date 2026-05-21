package com.navops.api.repository;

import com.navops.api.domain.entity.NavigationRoute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NavigationRouteRepository extends JpaRepository<NavigationRoute, UUID> {
}
