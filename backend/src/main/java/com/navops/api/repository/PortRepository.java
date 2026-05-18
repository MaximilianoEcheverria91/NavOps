package com.navops.api.repository;

import com.navops.api.domain.entity.Port;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PortRepository extends JpaRepository<Port, UUID> {
    
    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, UUID id);

    @EntityGraph(attributePaths = {"country", "province", "city"})
    List<Port> findAllByIsActiveTrue();
}
