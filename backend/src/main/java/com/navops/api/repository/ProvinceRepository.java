package com.navops.api.repository;

import com.navops.api.domain.entity.Province;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProvinceRepository extends JpaRepository<Province, UUID> {

    // Spring crea la consulta automáticamente por el nombre del método
    List<Province> findByCountryIdOrderByNameAsc(UUID countryId );
}

