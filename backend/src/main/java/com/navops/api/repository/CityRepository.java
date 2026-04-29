package com.navops.api.repository;

import com.navops.api.domain.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CityRepository extends JpaRepository<City, UUID> {

    List<City> findByProvinceIdOrderByNameAsc(UUID provinceId);
}
