package com.navops.api.repository.filters;

import com.navops.api.domain.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PersonFilterRepository extends JpaRepository<Person, UUID>, JpaSpecificationExecutor<Person> {
}
