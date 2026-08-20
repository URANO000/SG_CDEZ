package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.ConsultaNutricionalResponse;
import com.cdez.sg_cdez_api.entity.ConsultaNutricional;
import com.cdez.sg_cdez_api.repository.ConsultaNutricionalRepository;
import com.cdez.sg_cdez_api.service.ConsultaNutricionalService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
@Service
@AllArgsConstructor
public class ConsultaNutricionalServiceImpl implements ConsultaNutricionalService {
    private final ConsultaNutricionalRepository REPOSITORY;
    @Override
    public ConsultaNutricionalResponse listarConsultasNutricionalesFiltradas(ConsultaFiltro filtro) {
        return null;
    }

    @Override
    public ConsultaNutricionalResponse obtenerConsultaNutricionalPorId(UUID id) {
        return null;
    }

    @Override
    public ConsultaNutricionalResponse crearConsultaNutricional(ConsultaNutricionalCreateRequest request) {
        return null;
    }

    @Override
    public ConsultaNutricionalResponse actualizarConsultaNutricional(UUID id, ConsultaNutricionalUpdateRequest request) {
        return null;
    }

    @Override
    public ConsultaNutricionalResponse desactivarConsultaNutricional(UUID id) {
        return null;
    }

    private ConsultaNutricional obtenerConsultaNutricionalCheck(UUID id){
        return REPOSITORY.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Consulta Nutricional indicada no encontrada."
                ));
    }
}
