package com.navops.api.application.service;

import com.navops.api.application.dto.request.PersonnelRegistrationRequest;
import com.navops.api.domain.entity.Country;
import com.navops.api.domain.entity.CrewMember;
import com.navops.api.domain.entity.Person;
import com.navops.api.domain.entity.Role;
import com.navops.api.domain.entity.User;
import com.navops.api.domain.enums.CrewMemberStatusEnum;
import com.navops.api.domain.enums.DocumentTypeEnum;
import com.navops.api.domain.enums.GenderEnum;
import com.navops.api.domain.enums.MaritalStatusEnum;
import com.navops.api.infrastructure.exception.ResourceAlreadyExistsException;
import com.navops.api.repository.CountryRepository;
import com.navops.api.repository.CrewMemberRepository;
import com.navops.api.repository.PersonRepository;
import com.navops.api.repository.RoleRepository;
import com.navops.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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
    private String generateNextFileNumber() {
        Long nextVal = crewMemberRepository.getNextFileSequenceValue();
        // String.format con %05d rellena con ceros a la izquierda hasta llegar a 5 dígitos
        return String.format("LG%05d", nextVal);
    }

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

        String automaticFileNumber = generateNextFileNumber();
        log.info("Generado nuevo legajo automático: {}", automaticFileNumber);
/*
        String avatarUrl = null;
        if (image != null && !image.isEmpty()) {
            avatarUrl = imageStorageService.uploadImage(image, "profile_pictures");
        }
*/
        log.info("Buscando país con ID: {}", request.residenceInfo().countryId()); // Agregá esto
        Country country = countryRepository.findById(request.residenceInfo().countryId())
                .orElseThrow(() -> new IllegalArgumentException("El ID del país provisto no existe."));

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
                .nationality(request.generalInfo().nationality())
                .maritalStatus(MaritalStatusEnum.valueOf(request.generalInfo().maritalStatus().toUpperCase()))
                .gender(GenderEnum.valueOf(request.generalInfo().gender()))
                .birthDate(request.generalInfo().birthDate())
                .country(country)
                .email(request.contactInfo().email())
                .mobile(request.contactInfo().cellPhone())
                .addressStreet(request.residenceInfo().street())
                .addressNumber(request.residenceInfo().number())
                .addressCity(request.residenceInfo().locality())
                .addressProvince(request.residenceInfo().province())
                .addressPostalCode(request.residenceInfo().PostalCode())
               // .avatarUrl(avatarUrl)
                .user(savedUser)
                .build();



        CrewMember crewMember = new CrewMember();
        crewMember.setPerson(person); // Vinculamos antes de tener ID
        crewMember.setFileNumber(automaticFileNumber);
        crewMember.setMaritimeBookNumber(request.laborData().maritimeBookNumber());
        crewMember.setNavigationRole(request.laborData().navigationRole());
        crewMember.setCategory(request.laborData().category());
        crewMember.setHireDate(request.laborData().hireDate());
        crewMember.setStatus(CrewMemberStatusEnum.valueOf(request.laborData().status().toUpperCase()));

        // 3. LA CLAVE: Vinculamos el tripulante a la persona
        person.setCrewMember(crewMember);

        // 4. GUARDAMOS SOLO LA PERSONA (El cascade guarda al CrewMember solo)
        personRepository.save(person);

        log.info("Personal registrado exitosamente");
    }
}
