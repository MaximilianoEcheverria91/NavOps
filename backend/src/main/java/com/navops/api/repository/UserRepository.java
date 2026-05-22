package com.navops.api.repository;

import com.navops.api.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByUsernameAndIdNot(String username, UUID id);
    long countByRole_Name(String roleName);
    long countByIsActiveTrue();
    @Query("SELECT COUNT(u) FROM User u WHERE u.is_blocked = true")
    long countBlockedUsers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = false")
    long countByIsActiveFalse();
}
