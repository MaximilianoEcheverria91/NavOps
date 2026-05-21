package com.navops.api.repository;

import com.navops.api.domain.entity.PlanCrewAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PlanCrewAssignmentRepository extends JpaRepository<PlanCrewAssignment, UUID> {
    List<PlanCrewAssignment> findAllByNavigationPlanId(UUID navigationPlanId);
}
