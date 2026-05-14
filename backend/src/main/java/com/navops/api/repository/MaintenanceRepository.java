package com.navops.api.repository;

import com.navops.api.domain.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MaintenanceRepository extends JpaRepository<Maintenance, UUID> {
    List<Maintenance> findAllByShipIdAndDeletedAtIsNull(UUID shipId);
    List<Maintenance> findAllByShipIdInAndDeletedAtIsNull(List<UUID> shipIds);
}