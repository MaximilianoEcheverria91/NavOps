package com.navops.api.application.service;

import com.navops.api.application.dto.request.PersonnelRegistrationRequest;
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
                        .orElseThrow(()-> new IllegalArgumentException("El ID del país provisto no existe"));

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

    // ESTADÍSTICAS PARA DASHBOARD
    public StatsUserResponse getStatsUser() {

        try {
            log.info("Calculando estadísticas para el dashboard de administrador");
            long total = crewMemberRepository.countTotalUsers();
            long active = crewMemberRepository.countActiveUsers();
            // long available = crewMemberRepository.countAvailableCrew();

            return new StatsUserResponse(total, active);

        } catch (Exception e) {
            log.error("Error al calcular estadísticas: {}", e.getMessage());
            throw e;
        }
    }

    // LISTAR TODO EL PERSONAL (Resumen con los 7 campos)
    @Transactional(readOnly = true)
    public List<PersonnelSummaryResponse> getAllPersonnel() {
        log.info("Obteniendo todos los registros de personal (Resumen)");
        List<Person> people = personRepository.findAll();
        
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
                .orElseThrow(() -> new NoPersonnelFoundException("No se encontró el personal con el ID proporcionado."));

        return mapToPersonnelDetailedResponse(person);
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
                crewMemberStatus
        );
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
                isActive
        );
    }
}
