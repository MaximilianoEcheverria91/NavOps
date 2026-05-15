package com.navops.api.domain.specification;

import com.navops.api.domain.entity.CrewMember;
import com.navops.api.domain.entity.Person;
import com.navops.api.domain.entity.User;
import com.navops.api.domain.enums.AccessStatusEnum;
import com.navops.api.domain.enums.CrewMemberStatusEnum;
import com.navops.api.domain.enums.NavigationRoleEnum;
import com.navops.api.domain.enums.PeopleStatusEnum;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class PersonnelFilterSpecification {

    private PersonnelFilterSpecification() {
    }

    public static Specification<Person> build(
            UUID countryId,
            UUID provinceId,
            UUID cityId,
            Integer minAge,
            Integer maxAge,
            List<PeopleStatusEnum> personalStatuses,
            List<CrewMemberStatusEnum> workStatuses,
            List<NavigationRoleEnum> positions,
            Integer minSeniority,
            Integer maxSeniority,
            LocalDate entryDateFrom,
            LocalDate entryDateTo,
            Boolean hasSystemAccess,
            List<AccessStatusEnum> accessStatuses,
            List<String> roleNames) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            query.distinct(true);

            Join<Person, CrewMember> crewJoin = root.join("crewMember", JoinType.LEFT);
            Join<Person, User> userJoin = root.join("user", JoinType.LEFT);

            if (countryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("country").get("id"), countryId));
            }

            if (provinceId != null) {
                predicates.add(criteriaBuilder.equal(root.get("province").get("id"), provinceId));
            }

            if (cityId != null) {
                predicates.add(criteriaBuilder.equal(root.get("city").get("id"), cityId));
            }

            if (minAge != null || maxAge != null) {
                LocalDate today = LocalDate.now();
                LocalDate maxBirthDate = minAge != null
                        ? today.minusYears(minAge)
                        : null;
                LocalDate minBirthDate = maxAge != null
                        ? today.minusYears(maxAge + 1L)
                        : null;

                if (minBirthDate != null && maxBirthDate != null) {
                    predicates.add(criteriaBuilder.between(root.get("birthDate"), minBirthDate, maxBirthDate));
                } else if (minBirthDate != null) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("birthDate"), maxBirthDate));
                } else {
                    predicates.add(criteriaBuilder.greaterThan(root.get("birthDate"), minBirthDate));
                }
            }

            if (personalStatuses != null && !personalStatuses.isEmpty()) {
                predicates.add(root.get("status").in(personalStatuses));
            }

            if (workStatuses != null && !workStatuses.isEmpty()) {
                predicates.add(crewJoin.get("status").in(workStatuses));
            }

            if (positions != null && !positions.isEmpty()) {
                predicates.add(crewJoin.get("navigationRole").in(positions));
            }

            if (minSeniority != null || maxSeniority != null) {
                LocalDate today = LocalDate.now();
                if (minSeniority != null) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(crewJoin.get("hireDate"), today.minusYears(minSeniority)));
                }
                if (maxSeniority != null) {
                    predicates.add(criteriaBuilder.greaterThan(crewJoin.get("hireDate"), today.minusYears(maxSeniority + 1L)));
                }
            }

            if (entryDateFrom != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(crewJoin.get("hireDate"), entryDateFrom));
            }

            if (entryDateTo != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(crewJoin.get("hireDate"), entryDateTo));
            }

            if (hasSystemAccess != null) {
                if (hasSystemAccess) {
                    predicates.add(criteriaBuilder.isNotNull(root.get("user")));
                    predicates.add(criteriaBuilder.equal(userJoin.get("isActive"), true));
                } else {
                    predicates.add(criteriaBuilder.or(
                            criteriaBuilder.isNull(root.get("user")),
                            criteriaBuilder.equal(userJoin.get("isActive"), false)
                    ));
                }
            }

            if (accessStatuses != null && !accessStatuses.isEmpty()) {
                predicates.add(buildAccessStatusPredicate(root, crewJoin, userJoin, accessStatuses, criteriaBuilder));
            }

            if (roleNames != null && !roleNames.isEmpty()) {
                predicates.add(userJoin.get("role").get("name").in(roleNames));
            }

            if (predicates.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static Predicate buildAccessStatusPredicate(
            jakarta.persistence.criteria.Root<Person> root,
            Join<Person, CrewMember> crewJoin,
            Join<Person, User> userJoin,
            List<AccessStatusEnum> accessStatuses,
            jakarta.persistence.criteria.CriteriaBuilder criteriaBuilder) {

        List<Predicate> accessPredicates = new ArrayList<>();

        for (AccessStatusEnum status : accessStatuses) {
            switch (status) {
                case ACTIVE -> accessPredicates.add(criteriaBuilder.and(
                        criteriaBuilder.isNotNull(root.get("user")),
                        criteriaBuilder.equal(userJoin.get("isActive"), true),
                        criteriaBuilder.equal(userJoin.get("is_blocked"), false)
                ));
                case INACTIVE -> accessPredicates.add(criteriaBuilder.or(
                        criteriaBuilder.isNull(root.get("user")),
                        criteriaBuilder.equal(userJoin.get("isActive"), false)
                ));
                case BLOCKED -> accessPredicates.add(criteriaBuilder.and(
                        criteriaBuilder.isNotNull(root.get("user")),
                        criteriaBuilder.equal(userJoin.get("is_blocked"), true)
                ));
            }
        }

        return criteriaBuilder.or(accessPredicates.toArray(new Predicate[0]));
    }

    public static Sort getSortDirection(String sortBy, String direction) {
        Sort.Direction sortDirection = "DESC".equalsIgnoreCase(direction)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        return Sort.by(sortDirection, getSortColumn(sortBy));
    }

    public static String getSortColumn(String sortBy) {
        if (sortBy == null) {
            return "surname";
        }
        return switch (sortBy.toLowerCase()) {
            case "name", "fullname" -> "fullName";
            case "surname" -> "surname";
            case "filenumber", "file_number" -> "crewMember.fileNumber";
            case "hiredate", "hire_date" -> "crewMember.hireDate";
            case "status" -> "status";
            case "birthdate", "birth_date" -> "birthDate";
            case "id" -> "id";
            default -> "surname";
        };
    }
}
