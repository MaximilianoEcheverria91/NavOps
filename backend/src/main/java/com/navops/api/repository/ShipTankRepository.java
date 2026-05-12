package com.navops.api.repository;

import com.navops.api.domain.entity.ShipTank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ShipTankRepository extends JpaRepository<ShipTank, UUID> {
    List<ShipTank> findAllByShipIdAndContentTypeAndDeletedAtIsNull(UUID shipId, String contentType);
}