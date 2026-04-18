package com.navops.api.application.service;

import com.navops.api.application.dto.response.RoleResponseDto;
import com.navops.api.infrastructure.exception.NoRoleFoundException;
import com.navops.api.repository.RoleRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    public List<RoleResponseDto> getRoleForSelect() {
        log.info("Cargando lista de roles (ID y Nombre) para el frontend");
        List<RoleResponseDto> roles = roleRepository.findAllRoleForSelect();

        if (roles.isEmpty()){
            log.warn("Se intentó cargar la lista de roles pero la tabla está vacía");
            throw new NoRoleFoundException("No se encontraron roles cargados en el sistema.");
        }
        return roles;
    }
}

