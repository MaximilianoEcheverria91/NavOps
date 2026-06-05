package com.navops.api.application.service.travelPlan;

import com.navops.api.application.dto.request.travelPlan.TravelPlanFilterRequest;
import com.navops.api.application.dto.request.travelPlan.TravelPlanRequestDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanMetricsDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanResponseDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanSummaryResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TravelPlanService {

    TravelPlanResponseDTO createTravelPlan(TravelPlanRequestDTO dto);

    TravelPlanMetricsDTO getMetrics();

    List<TravelPlanSummaryResponseDTO> getActiveTravelPlans();

    Page<TravelPlanSummaryResponseDTO> getFilteredTravelPlans(TravelPlanFilterRequest filter, Pageable pageable);
}
