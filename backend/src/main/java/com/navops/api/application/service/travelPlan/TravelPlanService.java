package com.navops.api.application.service.travelPlan;

import com.navops.api.application.dto.request.travelPlan.TravelPlanFilterRequest;
import com.navops.api.application.dto.request.travelPlan.TravelPlanRequestDTO;
import com.navops.api.application.dto.response.travelPlan.GlobalVoyagesMetricsDTO;
import com.navops.api.application.dto.response.travelPlan.HistoryVoyagesMetricsDTO;
import com.navops.api.application.dto.response.travelPlan.MyVoyagesMetricsDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanMetricsDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanResponseDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanSummaryResponseDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanTelemetryResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface TravelPlanService {

    TravelPlanResponseDTO createTravelPlan(TravelPlanRequestDTO dto);

    TravelPlanMetricsDTO getMetrics();

    List<TravelPlanSummaryResponseDTO> getActiveTravelPlans();

    Page<TravelPlanSummaryResponseDTO> getFilteredTravelPlans(TravelPlanFilterRequest filter, Pageable pageable);

    TravelPlanResponseDTO getTravelPlanById(UUID id);

    TravelPlanResponseDTO updateTravelPlan(UUID id, TravelPlanRequestDTO dto);

    TravelPlanResponseDTO cancelTravelPlan(UUID id);

    TravelPlanResponseDTO startTravelPlan(UUID id);

    GlobalVoyagesMetricsDTO getGlobalVoyagesMetrics();

    MyVoyagesMetricsDTO getMyVoyagesMetrics(UUID userId);

    HistoryVoyagesMetricsDTO getHistoryVoyagesMetrics();

    List<TravelPlanSummaryResponseDTO> getMyAssignedVoyages(UUID userId);

    TravelPlanTelemetryResponseDTO getTelemetryByPlanId(UUID id);
}
