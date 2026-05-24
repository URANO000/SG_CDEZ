package com.cdez.sg_cdez_api.service;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorRequest;
import com.cdez.sg_cdez_api.dto.response.AdultoMayorResponse;

import java.util.List;

public interface AdultoMayorService {
    List<AdultoMayorResponse> listarAdultosMayores();
    AdultoMayorResponse crearAdultoMayor(AdultoMayorRequest request);
}