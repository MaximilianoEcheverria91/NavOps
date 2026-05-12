package com.navops.api.repository;

import com.navops.api.domain.entity.Engine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EngineRepository extends JpaRepository<Engine, UUID> {
    Optional<Engine> findFirstByShipIdAndDeletedAtIsNull(UUID shipId);
}