package com.navops.api.repository;

import com.navops.api.domain.entity.Person;
import com.navops.api.domain.enums.PeopleStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PersonRepository extends JpaRepository<Person, UUID>  {
    boolean existsByDocumentNumber(String documentNumber);
    boolean existsByEmail(String email);
    boolean existsByDocumentNumberAndIdNot(String documentNumber, UUID id);
    boolean existsByEmailAndIdNot(String email, UUID id);
    boolean existsByCuilAndIdNot(String cuil, UUID id);
    Optional<Person> findByDocumentNumber(String documentNumber);
    List<Person> findAllByStatus(PeopleStatusEnum status);
    long countByStatus(PeopleStatusEnum status);
    long countByUserIsNotNull();
}
