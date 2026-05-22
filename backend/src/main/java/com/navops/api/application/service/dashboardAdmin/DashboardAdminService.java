package com.navops.api.application.service.dashboardAdmin;

import com.navops.api.application.dto.response.dashboardAdmin.PeopleStatusCountResponse;
import com.navops.api.application.dto.response.dashboardAdmin.PortStatusCountResponse;
import com.navops.api.application.dto.response.user.StatsUserResponse;
import com.navops.api.domain.enums.PeopleStatusEnum;
import com.navops.api.domain.enums.PortStatusEnum;
import com.navops.api.repository.CrewMemberRepository;
import com.navops.api.repository.PersonRepository;
import com.navops.api.repository.PortRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardAdminService {

    private final CrewMemberRepository crewMemberRepository;
    private final PersonRepository personRepository;
    private final PortRepository portRepository;

    public StatsUserResponse getAdminDashboardStats() {

        try {
            log.info("Calculando estadísticas para el dashboard de administrador");
            long total = crewMemberRepository.countTotalUsers();
            long active = crewMemberRepository.countActiveUsers();
            //long available = crewMemberRepository.countAvailableCrew();

            return new StatsUserResponse(total, active);

        }catch (Exception e) {
            log.error("Error al calcular estadísticas: {}", e.getMessage());
            throw e;
        }
    }

    public PeopleStatusCountResponse countUsersByStatus() {
        log.info("Contando usuarios por estado");

        long active = personRepository.countByStatus(PeopleStatusEnum.ACTIVE);
        long inactive = personRepository.countByStatus(PeopleStatusEnum.INACTIVE);
        long vacation = personRepository.countByStatus(PeopleStatusEnum.VACATION);
        long medicalLeave = personRepository.countByStatus(PeopleStatusEnum.MEDICAL_LEAVE);
        long suspended = personRepository.countByStatus(PeopleStatusEnum.SUSPENDED);
        long total = active + inactive + vacation + medicalLeave + suspended;
        long totalUsersWithSystemAccess = personRepository.countByUserIsNotNull();

        return new PeopleStatusCountResponse(active, inactive, vacation, medicalLeave, suspended, total, totalUsersWithSystemAccess);
    }

    public PortStatusCountResponse countPortsByStatus() {
        log.info("Contando puertos por estado");

        long operational = portRepository.countByStatus(PortStatusEnum.OPERATIONAL);
        long underMaintenance = portRepository.countByStatus(PortStatusEnum.UNDER_MAINTENANCE);
        long closed = portRepository.countByStatus(PortStatusEnum.CLOSED);
        long full = portRepository.countByStatus(PortStatusEnum.FULL);
        long inactive = portRepository.countByStatus(PortStatusEnum.INACTIVE);
        long total = operational + underMaintenance + closed + full + inactive;

        return new PortStatusCountResponse(operational, underMaintenance, closed, full, inactive, total);
    }
}
