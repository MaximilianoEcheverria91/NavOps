package com.navops.api.application.service.travelPlan;

import com.navops.api.application.dto.request.travelPlan.TravelPlanRequestDTO;
import com.navops.api.application.dto.response.travelPlan.TravelPlanResponseDTO;

public interface TravelPlanService {

    TravelPlanResponseDTO createTravelPlan(TravelPlanRequestDTO dto);
}
