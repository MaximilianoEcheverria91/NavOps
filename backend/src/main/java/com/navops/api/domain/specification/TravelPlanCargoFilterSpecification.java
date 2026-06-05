package com.navops.api.domain.specification;

import com.navops.api.domain.entity.TravelPlanCargo;
import com.navops.api.domain.enums.travelPlanCargo.CargoTypeEnum;
import com.navops.api.domain.enums.travelPlanCargo.ContainerTypeEnum;
import com.navops.api.domain.enums.travelPlanCargo.ProductCategoryEnum;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TravelPlanCargoFilterSpecification {

    private TravelPlanCargoFilterSpecification() {
    }

    public static Specification<TravelPlanCargo> build(
            UUID planId,
            String productCategory,
            String cargoType,
            String containerType) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            query.distinct(true);

            predicates.add(criteriaBuilder.equal(root.get("travelPlan").get("id"), planId));
            predicates.add(criteriaBuilder.isNull(root.get("deletedAt")));

            if (productCategory != null && !productCategory.isBlank()) {
                try {
                    predicates.add(criteriaBuilder.equal(
                            root.get("productCategory"),
                            ProductCategoryEnum.valueOf(productCategory.toUpperCase())));
                } catch (IllegalArgumentException e) {
                    predicates.add(criteriaBuilder.equal(
                            root.get("productCategory"), productCategory));
                }
            }

            if (cargoType != null && !cargoType.isBlank()) {
                try {
                    predicates.add(criteriaBuilder.equal(
                            root.get("cargoType"),
                            CargoTypeEnum.valueOf(cargoType.toUpperCase())));
                } catch (IllegalArgumentException e) {
                    predicates.add(criteriaBuilder.equal(
                            root.get("cargoType"), cargoType));
                }
            }

            if (containerType != null && !containerType.isBlank()) {
                Predicate containerFilter;
                try {
                    containerFilter = criteriaBuilder.equal(
                            root.get("containerType"),
                            ContainerTypeEnum.valueOf(containerType.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    containerFilter = criteriaBuilder.equal(
                            root.get("containerType"), containerType);
                }
                predicates.add(criteriaBuilder.and(
                        criteriaBuilder.isNotNull(root.get("containerType")),
                        containerFilter));
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
        if (sortBy == null) return "productName";
        return switch (sortBy.toLowerCase()) {
            case "productname", "product_name" -> "productName";
            case "productcategory", "product_category" -> "productCategory";
            case "producttype", "product_type" -> "productType";
            case "cargotype", "cargo_type" -> "cargoType";
            case "containertype", "container_type" -> "containerType";
            case "status" -> "status";
            case "weighttonnes", "weight_tonnes" -> "weightTonnes";
            case "volumem3", "volume_m3" -> "volumeM3";
            case "quantity" -> "quantity";
            case "owningcompany", "owning_company" -> "owningCompany";
            case "id" -> "id";
            default -> "productName";
        };
    }
}
