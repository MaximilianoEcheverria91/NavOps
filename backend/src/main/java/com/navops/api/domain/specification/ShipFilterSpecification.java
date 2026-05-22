package com.navops.api.domain.specification;

import com.navops.api.domain.entity.Ship;
import com.navops.api.domain.enums.ShipStatusEnum;
import com.navops.api.domain.enums.ShipTypeEnum;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ShipFilterSpecification {

    private ShipFilterSpecification() {
    }

    public static Specification<Ship> build(
            List<ShipTypeEnum> shipTypes,
            UUID countryId,
            List<ShipStatusEnum> statuses,
            Integer minBuildYear,
            Integer maxBuildYear,
            Double minLength,
            Double maxLength,
            Double minBeam,
            Double maxBeam,
            Double minDraft,
            Double maxDraft,
            Double minDepth,
            Double maxDepth,
            Double minCargoCapacityTonnes,
            Double maxCargoCapacityTonnes,
            Integer minCrewCapacity,
            Integer maxCrewCapacity,
            Integer minHoldCount,
            Integer maxHoldCount,
            Double minMaxCapacityLiters,
            Double maxMaxCapacityLiters) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            query.distinct(true);

            if (shipTypes != null && !shipTypes.isEmpty()) {
                predicates.add(root.get("shipType").in(shipTypes));
            }

            if (countryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("country").get("id"), countryId));
            }

            if (statuses != null && !statuses.isEmpty()) {
                predicates.add(root.get("status").in(statuses));
            }

            if (minBuildYear != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("buildYear"), minBuildYear.shortValue()));
            }

            if (maxBuildYear != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("buildYear"), maxBuildYear.shortValue()));
            }

            if (minLength != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("length"), BigDecimal.valueOf(minLength)));
            }

            if (maxLength != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("length"), BigDecimal.valueOf(maxLength)));
            }

            if (minBeam != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("beam"), BigDecimal.valueOf(minBeam)));
            }

            if (maxBeam != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("beam"), BigDecimal.valueOf(maxBeam)));
            }

            if (minDraft != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("draft"), BigDecimal.valueOf(minDraft)));
            }

            if (maxDraft != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("draft"), BigDecimal.valueOf(maxDraft)));
            }

            if (minDepth != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("depth"), BigDecimal.valueOf(minDepth)));
            }

            if (maxDepth != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("depth"), BigDecimal.valueOf(maxDepth)));
            }

            if (minCargoCapacityTonnes != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("cargoCapacityTonnes"), BigDecimal.valueOf(minCargoCapacityTonnes)));
            }

            if (maxCargoCapacityTonnes != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("cargoCapacityTonnes"), BigDecimal.valueOf(maxCargoCapacityTonnes)));
            }

            if (minCrewCapacity != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("crewCapacity"), minCrewCapacity.shortValue()));
            }

            if (maxCrewCapacity != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("crewCapacity"), maxCrewCapacity.shortValue()));
            }

            if (minHoldCount != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("holdCount"), minHoldCount.shortValue()));
            }

            if (maxHoldCount != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("holdCount"), maxHoldCount.shortValue()));
            }

            if (minMaxCapacityLiters != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("maxCapacityLiters"), BigDecimal.valueOf(minMaxCapacityLiters)));
            }

            if (maxMaxCapacityLiters != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("maxCapacityLiters"), BigDecimal.valueOf(maxMaxCapacityLiters)));
            }

            if (predicates.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Sort getSortDirection(String sortBy, String direction) {
        Sort.Direction sortDirection = "DESC".equalsIgnoreCase(direction)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        return Sort.by(sortDirection, getSortColumn(sortBy));
    }

    public static String getSortColumn(String sortBy) {
        if (sortBy == null) {
            return "name";
        }
        return switch (sortBy.toLowerCase()) {
            case "name" -> "name";
            case "registration" -> "registration";
            case "imo", "imonumber", "imo_number" -> "imoNumber";
            case "status" -> "status";
            case "shiptype", "ship_type" -> "shipType";
            case "buildyear", "build_year" -> "buildYear";
            case "length" -> "length";
            case "beam" -> "beam";
            case "draft" -> "draft";
            case "depth" -> "depth";
            case "cargocapacitytonnes", "cargo_capacity_tonnes" -> "cargoCapacityTonnes";
            case "crewcapacity", "crew_capacity" -> "crewCapacity";
            case "holdcount", "hold_count" -> "holdCount";
            case "maxcapacityliters", "max_capacity_liters" -> "maxCapacityLiters";
            case "country" -> "country.name";
            case "id" -> "id";
            default -> "name";
        };
    }
}
