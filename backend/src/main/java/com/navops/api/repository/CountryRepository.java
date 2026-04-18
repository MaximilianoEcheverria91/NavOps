package com.navops.api.repository;

import com.navops.api.application.dto.response.CountryResponseDto;
import com.navops.api.domain.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CountryRepository extends JpaRepository<Country, UUID> {

    @Query("SELECT new com.navops.api.application.dto.response.CountryResponseDto(c.id, c.name) " +
            "FROM Country c ORDER BY c.name ASC")
    List<CountryResponseDto> findAllCountryForSelect();
}
