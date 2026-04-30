package com.navops.api.application.service;

import com.navops.api.application.dto.request.user.PersonnelRegistrationRequest;
import com.navops.api.application.dto.request.user.UserUpdateRequest;
import com.navops.api.application.dto.response.user.StatsUserResponse;
import com.navops.api.domain.entity.*;
import com.navops.api.domain.enums.*;
import com.navops.api.infrastructure.exception.ResourceAlreadyExistsException;
import com.navops.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.navops.api.application.dto.response.user.PersonnelSummaryResponse;
import com.navops.api.application.dto.response.user.PersonnelDetailedResponse;
import com.navops.api.application.dto.response.user.PersonnelEditResponse;
import com.navops.api.infrastructure.exception.NoPersonnelFoundException;

@Service
@RequiredArgsConstructor
@Slf4j
public class PersonnelService {

    private final PersonRepository personRepository;
    private final CrewMemberRepository crewMemberRepository;
    private final CountryRepository countryRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ImageStorageService imageStorageService;
    private final ProvinceRepository provinceRepository;
    private final CityRepository localityRepository;

    private String generateNextFileNumber() {
        Long nextVal = crewMemberRepository.getNextFileSequenceValue();
        // String.format con %05d rellena con ceros a la izquierda hasta llegar a 5
        // dígitos
        return String.format("LG%05d", nextVal);
    }

    // CREATE USER
    @Transactional
    public void registerPersonnel(PersonnelRegistrationRequest request, MultipartFile image) throws IOException {
        log.info("Registrando nuevo personal con documento: {}", request.generalInfo().documentNumber());

        if (personRepository.existsByDocumentNumber(request.generalInfo().documentNumber())) {
            throw new ResourceAlreadyExistsException("El documento ingresado ya se encuentra registrado.");
        }
        if (personRepository.existsByEmail(request.contactInfo().email())) {
            throw new ResourceAlreadyExistsException("El correo electrónico ya se encuentra registrado.");
        }
        if (crewMemberRepository.existsByMaritimeBookNumber(request.laborData().maritimeBookNumber())) {
            throw new ResourceAlreadyExistsException("El número de libreta marítima ya se encuentra registrado.");
        }

        String avatarUrl = null;
        if (image != null && !image.isEmpty()) {
            avatarUrl = imageStorageService.uploadImage(image, "profile_pictures");
        }
        log.info("Buscando pais para nacionalidad con ID: {}", request.generalInfo().nationalityCountryId());
        Country nacionalityCountry = countryRepository.findById(request.generalInfo().nationalityCountryId())
                .orElseThrow(() -> new IllegalArgumentException("El ID del país provisto no existe"));

        log.info("Buscando país con ID: {}", request.residenceInfo().countryId());
        Country country = countryRepository.findById(request.residenceInfo().countryId())
                .orElseThrow(() -> new IllegalArgumentException("El ID del país provisto no existe."));

        log.info("Buscando provincia con ID: {}", request.residenceInfo().provinceId());
        Province province = provinceRepository.findById(request.residenceInfo().provinceId())
                .orElseThrow(() -> new IllegalArgumentException("Provincia no encontrada"));

        log.info("Buscando ciudad con ID: {}", request.residenceInfo().cityId());
        City city = localityRepository.findById(request.residenceInfo().cityId())
                .orElseThrow(() -> new IllegalArgumentException("Ciudad no encontrada"));

        User savedUser = null;
        if (request.systemAccessData() != null && request.systemAccessData().belongsToSystem()) {
            if (userRepository.existsByUsername(request.systemAccessData().username())) {
                throw new ResourceAlreadyExistsException("El nombre de usuario ya está en uso.");
            }
            Role role = roleRepository.findById(request.systemAccessData().roleId())
                    .orElseThrow(() -> new IllegalArgumentException("El ID del rol provisto no existe."));

            User user = User.builder()
                    .username(request.systemAccessData().username())
                    .email(request.contactInfo().email())
                    .password(passwordEncoder.encode(request.systemAccessData().password()))
                    .role(role)
                    .isActive(true)
                    .build();
            savedUser = userRepository.save(user);
        }

        Person person = Person.builder()
                .fullName(request.generalInfo().name())
                .surname(request.generalInfo().surname())
                .documentType(DocumentTypeEnum.valueOf(request.generalInfo().documentType().toUpperCase()))
                .documentNumber(request.generalInfo().documentNumber())
                .cuil(request.generalInfo().cuil())
                .nationalityCountry(nacionalityCountry)
                .maritalStatus(MaritalStatusEnum.valueOf(request.generalInfo().maritalStatus().toUpperCase()))
                .gender(GenderEnum.valueOf(request.generalInfo().gender()))
                .status(PeopleStatusEnum.ACTIVE)
                .birthDate(request.generalInfo().birthDate())
                .country(country)
                .email(request.contactInfo().email())
                .mobile(request.contactInfo().cellPhone())
                .country(country)
                .province(province)
                .city(city)
                .addressStreet(request.residenceInfo().street())
                .addressNumber(request.residenceInfo().number())
                .addressPostalCode(request.residenceInfo().PostalCode())
                .avatarUrl(avatarUrl)
                .user(savedUser)
                .build();

        String automaticFileNumber = generateNextFileNumber();
        log.info("Generado nuevo legajo automático: {}", automaticFileNumber);

        CrewMember crewMember = CrewMember.builder()
                .person(person)
                .fileNumber(automaticFileNumber)
                .maritimeBookNumber(request.laborData().maritimeBookNumber())
                .navigationRole(request.laborData().navigationRole())
                .category(request.laborData().category())
                .hireDate(request.laborData().hireDate())
                .status(CrewMemberStatusEnum.AVAILABLE)
                .build();

        person.setCrewMember(crewMember);
        personRepository.save(person);
        log.info("Personal registrado exitosamente");
    }

    // UPDATE USER
    @Transactional
    public void updatePersonnel(UUID id, UserUpdateRequest request, MultipartFile image) throws IOException {
        log.info("Actualizando personal con ID: {}", id);

        Person person = personRepository.findById(id)
                .orElseThrow(
                        () -> new NoPersonnelFoundException("No se encontró el personal con el ID proporcionado."));

        if (personRepository.existsByDocumentNumberAndIdNot(request.generalInfo().documentNumber(), id)) {
            throw new ResourceAlreadyExistsException(
                    "El documento ingresado ya se encuentra registrado por otro usuario.");
        }
        if (personRepository.existsByEmailAndIdNot(request.contactInfo().email(), id)) {
            throw new ResourceAlreadyExistsException(
                    "El correo electrónico ya se encuentra registrado por otro usuario.");
        }
        if (request.generalInfo().cuil() != null && !request.generalInfo().cuil().isBlank()) {
            if (personRepository.existsByCuilAndIdNot(request.generalInfo().cuil(), id)) {
                throw new ResourceAlreadyExistsException("El CUIL ya se encuentra registrado por otro usuario.");
            }
        }

        if (person.getCrewMember() != null && request.laborData() != null) {
            UUID crewId = person.getCrewMember().getId();
            if (crewMemberRepository.existsByFileNumberAndIdNot(request.laborData().fileNumber(), crewId)) {
                throw new ResourceAlreadyExistsException(
                        "El número de legajo ya se encuentra registrado por otro usuario.");
            }
            if (crewMemberRepository.existsByMaritimeBookNumberAndIdNot(request.laborData().maritimeBookNumber(),
                    crewId)) {
                throw new ResourceAlreadyExistsException(
                        "El número de libreta marítima ya se encuentra registrado por otro usuario.");
            }
        }

        Country nationalityCountry = countryRepository.findById(request.generalInfo().nationalityCountryId())
                .orElseThrow(() -> new IllegalArgumentException("El ID del país de nacionalidad no existe."));

        Country country = countryRepository.findById(request.residenceInfo().countryId())
                .orElseThrow(() -> new IllegalArgumentException("El ID del país no existe."));

        Province province = provinceRepository.findById(request.residenceInfo().provinceId())
                .orElseThrow(() -> new IllegalArgumentException("Provincia no encontrada"));

        City city = localityRepository.findById(request.residenceInfo().cityId())
                .orElseThrow(() -> new IllegalArgumentException("Ciudad no encontrada"));

        // Update Person
        if (image != null && !image.isEmpty()) {
            String avatarUrl = imageStorageService.uploadImage(image, "profile_pictures");
            person.setAvatarUrl(avatarUrl);
        } else if (request.avatarUrl() != null && !request.avatarUrl().isEmpty()) {
            person.setAvatarUrl(request.avatarUrl());
        }

        person.setFullName(request.generalInfo().name());
        person.setSurname(request.generalInfo().surname());
        person.setDocumentType(DocumentTypeEnum.valueOf(request.generalInfo().documentType().toUpperCase()));
        person.setDocumentNumber(request.generalInfo().documentNumber());
        person.setCuil(request.generalInfo().cuil());
        person.setNationalityCountry(nationalityCountry);
        person.setMaritalStatus(MaritalStatusEnum.valueOf(request.generalInfo().maritalStatus().toUpperCase()));
        person.setGender(GenderEnum.valueOf(request.generalInfo().gender().toUpperCase()));
        person.setStatus(PeopleStatusEnum.valueOf(request.generalInfo().status().toUpperCase()));
        person.setBirthDate(request.generalInfo().birthDate());

        person.setCountry(country);
        person.setProvince(province);
        person.setCity(city);
        person.setAddressStreet(request.residenceInfo().street());
        person.setAddressNumber(request.residenceInfo().number());
        person.setAddressPostalCode(request.residenceInfo().postalCode());
        person.setAddressDepartment(request.residenceInfo().department());
        person.setAddressFloor(request.residenceInfo().floor());

        person.setEmail(request.contactInfo().email());
        person.setMobile(request.contactInfo().cellPhone());
        person.setHomePhone(request.contactInfo().particularPhone());

        // Update CrewMember
        if (person.getCrewMember() != null && request.laborData() != null) {
            CrewMember crew = person.getCrewMember();
            crew.setFileNumber(request.laborData().fileNumber());
            crew.setNavigationRole(request.laborData().navigationRole());
            crew.setCategory(request.laborData().category());
            crew.setHireDate(request.laborData().hireDate());
            crew.setMaritimeBookNumber(request.laborData().maritimeBookNumber());
            crew.setStatus(CrewMemberStatusEnum.valueOf(request.laborData().status().toUpperCase()));
        }

        // Update User
        if (request.systemAccessData() != null && request.systemAccessData().belongsToSystem()) {
            Role role = roleRepository.findById(request.systemAccessData().roleId())
                    .orElseThrow(() -> new IllegalArgumentException("El ID del rol provisto no existe."));

            User user = person.getUser();
            if (user != null) {
                if (userRepository.existsByUsernameAndIdNot(request.systemAccessData().username(), user.getId())) {
                    throw new ResourceAlreadyExistsException("El nombre de usuario ya está en uso por otra persona.");
                }
                user.setUsername(request.systemAccessData().username());
                user.setEmail(request.contactInfo().email());
                user.setRole(role);
                user.setActive(request.systemAccessData().isActive());
                user.set_blocked(request.systemAccessData().is_blocked());
            } else {
                throw new IllegalArgumentException(
                        "No se puede crear un nuevo acceso al sistema desde la edición si el usuario no tenía acceso previo (falta contraseña).");
            }
        } else if (person.getUser() != null && request.systemAccessData() != null
                && !request.systemAccessData().belongsToSystem()) {
            person.getUser().setActive(false);
        }

        personRepository.save(person);
        log.info("Personal actualizado exitosamente");
    }
    // LOGICAL DELETE / STATUS UPDATE
    @Transactional
    public void updatePersonnelStatus(UUID id, com.navops.api.application.dto.request.user.StatusUpdateRequest request) {
        log.info("Actualizando estado del personal con ID: {}", id);

        Person person = personRepository.findById(id)
                .orElseThrow(() -> new NoPersonnelFoundException("No se encontró el personal con el ID proporcionado."));

        PeopleStatusEnum newStatus = PeopleStatusEnum.valueOf(request.status().toUpperCase());
        person.setStatus(newStatus);

        boolean isNowActive = newStatus == PeopleStatusEnum.ACTIVE;

        if (person.getCrewMember() != null) {
            if (isNowActive) {
                person.getCrewMember().setStatus(CrewMemberStatusEnum.AVAILABLE);
            } else {
                person.getCrewMember().setStatus(CrewMemberStatusEnum.UNAVAILABLE);
            }
        }

        if (person.getUser() != null) {
            person.getUser().setActive(isNowActive);
            person.getUser().set_blocked(!isNowActive);
        }

        personRepository.save(person);
        log.info("Estado actualizado exitosamente");
    }

    // ESTADÍSTICAS PARA DASHBOARD
    public StatsUserResponse getStatsUser() {

        try {
            log.info("Calculando estadísticas para el dashboard de administrador");

            // Contamos solo los que están ACTIVE
            long active =  personRepository.countByStatus(PeopleStatusEnum.ACTIVE);

            // Contamos los usuarios disponibles
            long totalAvailable = crewMemberRepository.countByStatus(CrewMemberStatusEnum.AVAILABLE);
            
            // long available = crewMemberRepository.countAvailableCrew();
            return new StatsUserResponse(active,totalAvailable);

        } catch (Exception e) {
            log.error("Error al calcular estadísticas: {}", e.getMessage());
            throw e;
        }
    }

    /*
    * public StatsUserResponse getStatsUser() {
    try {
        log.info("Calculando estadísticas para el dashboard de administrador");

        // Contamos solo los que están ACTIVE
        long activeCount = personRepository.countByStatus(PeopleStatusEnum.ACTIVE);

        // Si querés que el Dashboard solo refleje la realidad operativa actual:
        return new StatsUserResponse(activeCount, activeCount);

    } catch (Exception e) {
        log.error("Error al calcular estadísticas: {}", e.getMessage());
        throw e;
    }
}*/

    // LISTAR TODO EL PERSONAL (Resumen con los 7 campos)
    @Transactional(readOnly = true)
    public List<PersonnelSummaryResponse> getAllPersonnel() {
        log.info("Obteniendo todos los registros de personal (Resumen)");
        List<Person> people = personRepository.findAllByStatus(PeopleStatusEnum.ACTIVE);

        if (people.isEmpty()) {
            throw new NoPersonnelFoundException("No hay registros de personal en el sistema.");
        }

        return people.stream()
                .map(this::mapToPersonnelSummaryResponse)
                .collect(Collectors.toList());
    }

    // OBTENER PERSONAL POR ID (Toda la información completa)
    @Transactional(readOnly = true)
    public PersonnelDetailedResponse getPersonnelById(UUID id) {
        log.info("Buscando personal detallado con ID: {}", id);
        Person person = personRepository.findById(id)
                .orElseThrow(
                        () -> new NoPersonnelFoundException("No se encontró el personal con el ID proporcionado."));

        return mapToPersonnelDetailedResponse(person);
    }

    // OBTENER PERSONAL PARA EDICIÓN
    @Transactional(readOnly = true)
    public PersonnelEditResponse getPersonnelForEdit(UUID id) {
        log.info("Buscando personal para edición con ID: {}", id);
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new NoPersonnelFoundException("No se encontró el personal con el ID proporcionado."));

        return new PersonnelEditResponse(
                person.getId(),
                person.getAvatarUrl(),
                mapEditGeneralInfo(person),
                mapEditResidenceInfo(person),
                mapEditContactInfo(person),
                mapEditLaborData(person),
                mapEditSystemAccessData(person)
        );
    }

    private PersonnelEditResponse.GeneralInfo mapEditGeneralInfo(Person person) {
        return new PersonnelEditResponse.GeneralInfo(
                person.getFullName(),
                person.getSurname(),
                person.getDocumentType() != null ? person.getDocumentType().name() : null,
                person.getDocumentNumber(),
                person.getCuil(),
                person.getBirthDate(),
                person.getNationalityCountry() != null ? person.getNationalityCountry().getName() : null,
                person.getMaritalStatus() != null ? person.getMaritalStatus().name() : null,
                person.getNationalityCountry() != null ? person.getNationalityCountry().getId() : null,
                person.getGender() != null ? person.getGender().name() : null,
                person.getStatus() != null ? person.getStatus().name() : null
        );
    }

    private PersonnelEditResponse.ResidenceInfo mapEditResidenceInfo(Person person) {
        return new PersonnelEditResponse.ResidenceInfo(
                person.getCountry() != null ? person.getCountry().getId() : null,
                person.getProvince() != null ? person.getProvince().getId() : null,
                person.getCity() != null ? person.getCity().getId() : null,
                person.getAddressPostalCode(),
                person.getAddressStreet(),
                person.getAddressNumber(),
                person.getAddressDepartment(),
                person.getAddressFloor()
        );
    }

    private PersonnelEditResponse.ContactInfo mapEditContactInfo(Person person) {
        return new PersonnelEditResponse.ContactInfo(
                person.getHomePhone(),
                person.getMobile(),
                person.getEmail()
        );
    }

    private PersonnelEditResponse.LaborData mapEditLaborData(Person person) {
        if (person.getCrewMember() == null) {
            return null;
        }
        CrewMember crew = person.getCrewMember();
        return new PersonnelEditResponse.LaborData(
                crew.getFileNumber(),
                crew.getNavigationRole(),
                crew.getCategory(),
                crew.getHireDate(),
                crew.getMaritimeBookNumber(),
                crew.getStatus() != null ? crew.getStatus().name() : null
        );
    }

    private PersonnelEditResponse.SystemAccessData mapEditSystemAccessData(Person person) {
        User user = person.getUser();
        if (user == null) {
            return new PersonnelEditResponse.SystemAccessData(false, null, null, false, false);
        }
        return new PersonnelEditResponse.SystemAccessData(
                true,
                user.getUsername(),
                user.getRole() != null ? user.getRole().getId() : null,
                user.isActive(),
                user.is_blocked()
        );
    }

    private PersonnelSummaryResponse mapToPersonnelSummaryResponse(Person person) {
        String position = null;
        String fileNumber = null;
        int yearsOfService = 0;
        String maritimeBookNumber = null;
        String crewMemberStatus = null;

        if (person.getCrewMember() != null) {
            position = person.getCrewMember().getCategory();
            fileNumber = person.getCrewMember().getFileNumber();
            maritimeBookNumber = person.getCrewMember().getMaritimeBookNumber();
            if (person.getCrewMember().getHireDate() != null) {
                yearsOfService = Period.between(person.getCrewMember().getHireDate(), LocalDate.now()).getYears();
            }
            if (person.getCrewMember().getStatus() != null) {
                crewMemberStatus = person.getCrewMember().getStatus().name();
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
                crewMemberStatus);
    }

    private PersonnelDetailedResponse mapToPersonnelDetailedResponse(Person person) {
        String fileNumber = null;
        String maritimeBookNumber = null;
        String navigationRole = null;
        String category = null;
        LocalDate hireDate = null;
        int yearsOfService = 0;
        String crewMemberStatus = null;

        if (person.getCrewMember() != null) {
            fileNumber = person.getCrewMember().getFileNumber();
            maritimeBookNumber = person.getCrewMember().getMaritimeBookNumber();
            navigationRole = person.getCrewMember().getNavigationRole();
            category = person.getCrewMember().getCategory();
            hireDate = person.getCrewMember().getHireDate();
            if (hireDate != null) {
                yearsOfService = Period.between(hireDate, LocalDate.now()).getYears();
            }
            if (person.getCrewMember().getStatus() != null) {
                crewMemberStatus = person.getCrewMember().getStatus().name();
            }
        }

        String username = null;
        String systemRole = null;
        boolean isActive = false;

        if (person.getUser() != null) {
            username = person.getUser().getUsername();
            isActive = person.getUser().isActive();
            if (person.getUser().getRole() != null) {
                systemRole = person.getUser().getRole().getName();
            }
        }

        return new PersonnelDetailedResponse(
                person.getId(),
                person.getDocumentType() != null ? person.getDocumentType().name() : null,
                person.getDocumentNumber(),
                person.getCuil(),
                person.getFullName(),
                person.getSurname(),
                person.getNationalityCountry().getName(),
                person.getMaritalStatus() != null ? person.getMaritalStatus().name() : null,
                person.getGender() != null ? person.getGender().name() : null,
                person.getBirthDate(),

                person.getEmail(),
                person.getMobile(),
                person.getHomePhone(),
                person.getAddressStreet(),
                person.getAddressNumber(),
                person.getAddressFloor(),
                person.getAddressDepartment(),
                person.getCity().getName(),
                person.getProvince().getName(),
                person.getAddressPostalCode(),
                person.getCountry() != null ? person.getCountry().getName() : null,

                fileNumber,
                maritimeBookNumber,
                navigationRole,
                category,
                hireDate,
                yearsOfService,
                crewMemberStatus,

                username,
                systemRole,
                person.getAvatarUrl(),
                isActive);
    }
}
