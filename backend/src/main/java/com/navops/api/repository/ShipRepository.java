package com.navops.api.repository;

import com.navops.api.domain.entity.Ship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ShipRepository extends JpaRepository<Ship, UUID> {
    List<Ship> findAllByDeletedAtIsNull();
    Optional<Ship> findByIdAndDeletedAtIsNull(UUID id);
}