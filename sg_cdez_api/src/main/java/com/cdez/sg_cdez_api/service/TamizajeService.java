package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.response.TamizajeResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface TamizajeService {
    List<TamizajeResponse> listarTamizajesPorConsulta(UUID id);
}
