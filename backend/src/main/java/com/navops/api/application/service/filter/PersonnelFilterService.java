package com.navops.api.application.service.filter;

import com.navops.api.application.dto.request.user.PersonnelFilterRequest;
import com.navops.api.application.dto.response.user.PersonnelFilterResponse;
import com.navops.api.application.dto.response.user.PersonnelSummaryResponse;
import com.navops.api.domain.entity.CrewMember;
import com.navops.api.domain.entity.Person;
import com.navops.api.domain.enums.SystemRoleFilterEnum;
import com.navops.api.domain.specification.PersonnelFilterSpecification;
import com.navops.api.repository.filters.PersonFilterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PersonnelFilterService {

    private final PersonFilterRepository personFilterRepository;

    @Transactional(readOnly = true)
    public PersonnelFilterResponse filterPersonnel(PersonnelFilterRequest request) {
        log.info("Ejecutando filtros avanzados de personal");

        validateAgeFilter(request.minAge(), request.maxAge());
        validateSeniorityFilter(request.minSeniority(), request.maxSeniority());

        List<String> roleNames = mapRolesToNames(request.roles());

        Specification<Person> spec = PersonnelFilterSpecification.build(
                request.countryId(),
                request.provinceId(),
                request.cityId(),
                request.minAge(),
                request.maxAge(),
                request.personalStatuses(),
                request.workStatuses(),
                request.positions(),
                request.minSeniority(),
                request.maxSeniority(),
                request.entryDateFrom(),
                request.entryDateTo(),
                request.hasSystemAccess(),
                request.accessStatuses(),
                roleNames
        );

        Sort sort = PersonnelFilterSpecification.getSortDirection(request.sortBy(), request.sortDirection());
        PageRequest pageRequest = PageRequest.of(request.page(), request.size(), sort);

        Page<Person> page = personFilterRepository.findAll(spec, pageRequest);

        List<PersonnelSummaryResponse> content = page.getContent().stream()
                .map(this::mapToSummaryResponse)
                .collect(Collectors.toList());

        return new PersonnelFilterResponse(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast(),
                page.isFirst()
        );
    }

    private List<String> mapRolesToNames(List<SystemRoleFilterEnum> roles) {
        if (roles == null || roles.isEmpty()) {
            return null;
        }
        return roles.stream()
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    private void validateAgeFilter(Integer minAge, Integer maxAge) {
        if (minAge != null && minAge < 18) {
            throw new IllegalArgumentException("La edad mínima no puede ser menor a 18 años");
        }
        if (minAge != null && maxAge != null && maxAge <= minAge) {
            throw new IllegalArgumentException("La edad máxima debe ser mayor que la edad mínima");
        }
    }

    private void validateSeniorityFilter(Integer minSeniority, Integer maxSeniority) {
        if (minSeniority != null && maxSeniority != null && maxSeniority <= minSeniority) {
            throw new IllegalArgumentException("La antigüedad máxima debe ser mayor que la antigüedad mínima");
        }
    }

    private PersonnelSummaryResponse mapToSummaryResponse(Person person) {
        String position = null;
        String fileNumber = null;
        int yearsOfService = 0;
        String maritimeBookNumber = null;
        String crewMemberStatus = null;

        CrewMember crew = person.getCrewMember();
        if (crew != null) {
            position = crew.getCategory();
            fileNumber = crew.getFileNumber();
            maritimeBookNumber = crew.getMaritimeBookNumber();
            if (crew.getHireDate() != null) {
                yearsOfService = Period.between(crew.getHireDate(), LocalDate.now()).getYears();
            }
            if (crew.getStatus() != null) {
                crewMemberStatus = crew.getStatus().name();
            }
        }

        String systemRole = null;
        if (person.getUser() != null && person.getUser().getRole() != null) {
            systemRole = person.getUser().getRole().getName();
        }

        return new PersonnelSummaryResponse(
                person.getId(),
                person.getFullName(),
                person.getSurname(),
                position,
                fileNumber,
                yearsOfService,
                systemRole,
                maritimeBookNumber,
                person.getAvatarUrl(),
                crewMemberStatus
        );
    }
}
