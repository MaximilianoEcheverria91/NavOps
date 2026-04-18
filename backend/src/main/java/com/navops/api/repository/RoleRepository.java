package com.navops.api.repository;

import com.navops.api.application.dto.response.CountryResponseDto;
import com.navops.api.application.dto.response.RoleResponseDto;
import com.navops.api.domain.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(String name);

    @Query("SELECT new com.navops.api.application.dto.response.RoleResponseDto(c.id, c.name) " +
            "FROM Role c ORDER BY c.name ASC")
    List<RoleResponseDto> findAllRoleForSelect();
}
