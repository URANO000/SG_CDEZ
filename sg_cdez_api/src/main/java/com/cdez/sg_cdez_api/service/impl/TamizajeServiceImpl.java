package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.response.TamizajeResponse;
import com.cdez.sg_cdez_api.service.TamizajeService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class TamizajeServiceImpl implements TamizajeService {
    @Override
    public List<TamizajeResponse> listarTamizajesPorConsulta(UUID id) {
        return List.of();
    }
}
