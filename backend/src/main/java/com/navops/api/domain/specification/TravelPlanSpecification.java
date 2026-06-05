package com.navops.api.domain.specification;

import com.navops.api.application.dto.request.travelPlan.TravelPlanFilterRequest;
import com.navops.api.domain.entity.TravelPlan;
import com.navops.api.domain.entity.TravelPlanCargo;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

public class TravelPlanSpecification {

    private TravelPlanSpecification() {
    }

    public static Specification<TravelPlan> buildSpecification(TravelPlanFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            query.distinct(true);

            predicates.add(criteriaBuilder.isNull(root.get("deletedAt")));

            if (filter.statuses() != null && !filter.statuses().isEmpty()) {
                predicates.add(root.get("status").as(String.class).in(filter.statuses()));
            }

            if (filter.departureFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("departureTime"), filter.departureFrom()));
            }
            if (filter.departureTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("departureTime"), filter.departureTo()));
            }

            if (filter.arrivalFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("eta"), filter.arrivalFrom()));
            }
            if (filter.arrivalTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("eta"), filter.arrivalTo()));
            }

            boolean hasCargoFilters = hasCargoFilterCriteria(filter);
            if (hasCargoFilters) {
                Join<TravelPlan, TravelPlanCargo> cargoJoin = root.join("cargoItems");

                if (filter.productCategories() != null && !filter.productCategories().isEmpty()) {
                    predicates.add(cargoJoin.get("productCategory").as(String.class).in(filter.productCategories()));
                }
                if (filter.cargoTypes() != null && !filter.cargoTypes().isEmpty()) {
                    predicates.add(cargoJoin.get("cargoType").as(String.class).in(filter.cargoTypes()));
                }
                if (filter.containerTypes() != null && !filter.containerTypes().isEmpty()) {
                    predicates.add(cargoJoin.get("containerType").as(String.class).in(filter.containerTypes()));
                }
                if (filter.hazardousMaterial() != null) {
                    predicates.add(criteriaBuilder.equal(
                            cargoJoin.get("hazardousMaterial"), filter.hazardousMaterial()));
                }
            }

            if (predicates.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static boolean hasCargoFilterCriteria(TravelPlanFilterRequest filter) {
        return (filter.productCategories() != null && !filter.productCategories().isEmpty())
                || (filter.cargoTypes() != null && !filter.cargoTypes().isEmpty())
                || (filter.containerTypes() != null && !filter.containerTypes().isEmpty())
                || filter.hazardousMaterial() != null;
    }
}
