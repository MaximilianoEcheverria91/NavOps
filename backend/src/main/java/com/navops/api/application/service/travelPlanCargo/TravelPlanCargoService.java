package com.navops.api.application.service.travelPlanCargo;

import com.navops.api.application.dto.request.travelPlanCargo.TravelPlanCargoRequestDTO;
import com.navops.api.application.dto.response.travelPlanCargo.TravelPlanCargoResponseDTO;

import java.util.List;
import java.util.UUID;

public interface TravelPlanCargoService {

    List<TravelPlanCargoResponseDTO> getCargosByPlanId(UUID planId);

    List<TravelPlanCargoResponseDTO> saveCargos(UUID planId, List<TravelPlanCargoRequestDTO> requests);
}
