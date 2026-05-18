package com.navops.api.domain.specification;

import com.navops.api.domain.entity.Port;
import com.navops.api.domain.enums.DockTypeEnum;
import com.navops.api.domain.enums.PortStatusEnum;
import com.navops.api.domain.enums.TypePortEnum;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class PortFilterSpecification {

    private PortFilterSpecification() {
    }

    public static Specification<Port> build(
            UUID countryId,
            UUID provinceId,
            UUID cityId,
            List<TypePortEnum> portTypes,
            List<DockTypeEnum> dockTypes,
            List<PortStatusEnum> statuses,
            Integer minDockCount,
            Integer maxDockCount,
            Double minMaxLength,
            Double maxMaxLength,
            Double minMaxDraft,
            Double maxMaxDraft) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            query.distinct(true);

            if (countryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("country").get("id"), countryId));
            }

            if (provinceId != null) {
                predicates.add(criteriaBuilder.equal(root.get("province").get("id"), provinceId));
            }

            if (cityId != null) {
                predicates.add(criteriaBuilder.equal(root.get("city").get("id"), cityId));
            }

            if (portTypes != null && !portTypes.isEmpty()) {
                predicates.add(root.get("portType").in(portTypes));
            }

            if (dockTypes != null && !dockTypes.isEmpty()) {
                predicates.add(root.get("dockType").in(dockTypes));
            }

            if (statuses != null && !statuses.isEmpty()) {
                predicates.add(root.get("status").in(statuses));
            }

            if (minDockCount != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("dockCount"), minDockCount.shortValue()));
            }

            if (maxDockCount != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("dockCount"), maxDockCount.shortValue()));
            }

            if (minMaxLength != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("maxLength"), minMaxLength));
            }

            if (maxMaxLength != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("maxLength"), maxMaxLength));
            }

            if (minMaxDraft != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("maxDraft"), minMaxDraft));
            }

            if (maxMaxDraft != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("maxDraft"), maxMaxDraft));
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
            case "code" -> "code";
            case "status" -> "status";
            case "porttype", "port_type" -> "portType";
            case "docktype", "dock_type" -> "dockType";
            case "dockcount", "dock_count" -> "dockCount";
            case "maxlength", "max_length" -> "maxLength";
            case "maxdraft", "max_draft" -> "maxDraft";
            case "country" -> "country.name";
            case "province" -> "province.name";
            case "city" -> "city.name";
            case "id" -> "id";
            default -> "name";
        };
    }
}
