package com.navops.api.application.service.DashboardNavigation;

import com.navops.api.application.dto.response.travelPlan.TravelPlanResponseDTO;
import com.navops.api.application.service.travelPlan.TravelPlanService;
import com.navops.api.domain.entity.*;
import com.navops.api.domain.enums.TravelPlanStatusEnum;
import com.navops.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TelemetrySimulatorService {

    private static final double STEP_DEGREES = 0.05;
    private static final double ARRIVAL_THRESHOLD = 0.05;

    private final TravelPlanRepository travelPlanRepository;
    private final ShipTelemetryRepository shipTelemetryRepository;
    private final TankReadingRepository tankReadingRepository;
    private final EngineRepository engineRepository;
    private final ShipTankRepository shipTankRepository;
    private final TravelPlanService travelPlanService;
    private final SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRate = 10000)
    @Transactional(rollbackFor = Exception.class)
    public void simulateTelemetry() {
        List<TravelPlan> activePlans = travelPlanRepository.findByStatusAndDeletedAtIsNull(TravelPlanStatusEnum.IN_PROGRESS);

        if (activePlans.isEmpty()) {
            return;
        }

        log.info("Simulando telemetria para {} travesia(s) activa(s)", activePlans.size());

        for (TravelPlan plan : activePlans) {
            try {
                simulatePlanMovement(plan);
            } catch (Exception e) {
                log.error("Error simulando telemetria para plan ID: {}", plan.getId(), e);
            }
        }
    }

    private void simulatePlanMovement(TravelPlan plan) {
        BigDecimal currentLat = plan.getCurrentLatitude();
        BigDecimal currentLon = plan.getCurrentLongitude();

        if (currentLat == null || currentLon == null) {
            log.warn("Plan ID {} sin posicion inicial, saltando simulacion", plan.getId());
            return;
        }

        // --- 1. Determinar punto objetivo (escala pendiente o destino final) ---
        List<Stop> sortedStops = plan.getStops().stream()
                .sorted(Comparator.comparing(Stop::getSequence))
                .toList();

        Port targetPort = resolveTargetPort(sortedStops, currentLat.doubleValue(), currentLon.doubleValue(), plan.getDestinationPort());

        boolean isFinalDestination = (targetPort == plan.getDestinationPort());

        // --- 2. Simular movimiento geografico hacia el objetivo ---
        BigDecimal targetLat = BigDecimal.valueOf(targetPort.getLatitude());
        BigDecimal targetLon = BigDecimal.valueOf(targetPort.getLongitude());

        double dx = targetLon.doubleValue() - currentLon.doubleValue();
        double dy = targetLat.doubleValue() - currentLat.doubleValue();
        double distToTarget = Math.sqrt(dx * dx + dy * dy);

        BigDecimal newLat;
        BigDecimal newLon;

        if (distToTarget <= ARRIVAL_THRESHOLD) {
            newLat = targetLat;
            newLon = targetLon;
        } else {
            double ratio = STEP_DEGREES / distToTarget;
            newLat = currentLat.add(BigDecimal.valueOf(dy * ratio));
            newLon = currentLon.add(BigDecimal.valueOf(dx * ratio));
        }

        plan.setCurrentLatitude(newLat);
        plan.setCurrentLongitude(newLon);

        double angle = Math.toDegrees(Math.atan2(dx, dy));
        int heading = (int) Math.round(angle);
        if (heading < 0) heading += 360;
        plan.setCurrentHeading(heading);

        // --- 3. Simular consumo de combustible ---
        simulateFuelConsumption(plan);

        // --- 4. Guardar historial de telemetria ---
        ShipTelemetry telemetry = ShipTelemetry.builder()
                .travelPlan(plan)
                .latitude(newLat)
                .longitude(newLon)
                .speedKnots(new BigDecimal("18.0"))
                .heading(heading)
                .weatherCondition("Despejado")
                .recordedAt(OffsetDateTime.now())
                .build();

        shipTelemetryRepository.save(telemetry);

        // --- 5. Verificar fin de travesia ---
        if (isFinalDestination && distToTarget <= ARRIVAL_THRESHOLD) {
            plan.setStatus(TravelPlanStatusEnum.COMPLETED);
            plan.setProgressPercentage(new BigDecimal("100.00"));
            log.info("Travesia ID {} completada exitosamente", plan.getId());
        } else {
            int progress = calculateProgressPercentage(plan, newLat.doubleValue(), newLon.doubleValue());
            plan.setProgressPercentage(BigDecimal.valueOf(progress));
        }

        // --- 6. Persistir cambios del plan ---
        TravelPlan saved = travelPlanRepository.save(plan);

        // --- 7. Notificar al Frontend via WebSocket ---
        TravelPlanResponseDTO dto = travelPlanService.getTravelPlanById(saved.getId());
        messagingTemplate.convertAndSend("/topic/voyage/" + saved.getId(), dto);
    }

    private Port resolveTargetPort(List<Stop> sortedStops, double currentLat, double currentLon, Port destinationPort) {
        for (Stop stop : sortedStops) {
            double dlat = stop.getPort().getLatitude() - currentLat;
            double dlon = stop.getPort().getLongitude() - currentLon;
            double dist = Math.sqrt(dlat * dlat + dlon * dlon);
            if (dist > ARRIVAL_THRESHOLD) {
                return stop.getPort();
            }
        }
        return destinationPort;
    }

    private void simulateFuelConsumption(TravelPlan plan) {
        Engine engine = engineRepository.findFirstByShipIdAndDeletedAtIsNull(plan.getShip().getId()).orElse(null);
        if (engine == null) return;

        BigDecimal consumptionPerMinute = engine.getFuelConsumptionLitersPerHour()
                .divide(BigDecimal.valueOf(60), 4, RoundingMode.HALF_UP);

        List<ShipTank> tanks = shipTankRepository.findAllByShipIdAndDeletedAtIsNull(plan.getShip().getId());
        if (tanks.isEmpty()) return;

        Map<ShipTank, BigDecimal> volumes = new HashMap<>();
        BigDecimal totalRemaining = BigDecimal.ZERO;

        for (ShipTank tank : tanks) {
            TankReading lastReading = tankReadingRepository
                    .findTopByTankIdAndTravelPlanIdOrderByRecordedAtDesc(tank.getId(), plan.getId())
                    .orElse(null);
            BigDecimal vol = (lastReading != null)
                    ? lastReading.getCurrentVolumeLiters()
                    : tank.getMaxCapacityLiters();
            volumes.put(tank, vol);
            totalRemaining = totalRemaining.add(vol);
        }

        if (totalRemaining.compareTo(BigDecimal.ZERO) <= 0) return;

        for (ShipTank tank : tanks) {
            BigDecimal currentVolume = volumes.get(tank);
            BigDecimal proportion = currentVolume.divide(totalRemaining, 10, RoundingMode.HALF_UP);
            BigDecimal tankConsumption = consumptionPerMinute.multiply(proportion)
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal newVolume = currentVolume.subtract(tankConsumption);
            if (newVolume.compareTo(BigDecimal.ZERO) < 0) {
                newVolume = BigDecimal.ZERO;
            }

            BigDecimal newPercentage = newVolume.multiply(BigDecimal.valueOf(100))
                    .divide(tank.getMaxCapacityLiters(), 2, RoundingMode.HALF_UP);

            TankReading reading = TankReading.builder()
                    .tank(tank)
                    .travelPlan(plan)
                    .currentVolumeLiters(newVolume)
                    .fillPercentage(newPercentage)
                    .build();

            tankReadingRepository.save(reading);
        }
    }

    private int calculateProgressPercentage(TravelPlan plan, double currentLat, double currentLon) {
        double ox = plan.getOriginPort().getLongitude();
        double oy = plan.getOriginPort().getLatitude();
        double dx = plan.getDestinationPort().getLongitude();
        double dy = plan.getDestinationPort().getLatitude();

        double totalDist = Math.sqrt(Math.pow(dx - ox, 2) + Math.pow(dy - oy, 2));
        if (totalDist <= 0) return 0;

        double traveledDist = Math.sqrt(Math.pow(currentLon - ox, 2) + Math.pow(currentLat - oy, 2));
        return (int) Math.min(99, (traveledDist / totalDist) * 100);
    }
}
