package com.navops.api.repository.filters;

import com.navops.api.domain.entity.Port;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PortFilterRepository extends JpaRepository<Port, UUID>, JpaSpecificationExecutor<Port> {
}
