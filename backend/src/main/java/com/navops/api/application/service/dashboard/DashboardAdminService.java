package com.navops.api.application.service.dashboard;

import com.navops.api.application.dto.response.dashboard.DashboardStatsUserResponse;
import com.navops.api.repository.CrewMemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardAdminService {

    private final CrewMemberRepository crewMemberRepository;

    public DashboardStatsUserResponse getAdminDashboardStats() {

        try {
            log.info("Calculando estadísticas para el dashboard de administrador");
            long total = crewMemberRepository.countTotalUsers();
            long active = crewMemberRepository.countActiveUsers();
            //long available = crewMemberRepository.countAvailableCrew();

            return new DashboardStatsUserResponse(total, active);

        }catch (Exception e) {
            log.error("Error al calcular estadísticas: {}", e.getMessage());
            throw e;
        }
    }
}
