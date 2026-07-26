package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.ConsultaFiltro;
import com.cdez.sg_cdez_api.dto.response.ConsultaResponse;
import com.cdez.sg_cdez_api.dto.response.PageResponse;
import com.cdez.sg_cdez_api.entity.Consulta;
import com.cdez.sg_cdez_api.repository.ConsultaRepository;
import com.cdez.sg_cdez_api.repository.specifications.ConsultaSpecs;
import com.cdez.sg_cdez_api.service.ConsultaService;
import com.cdez.sg_cdez_api.util.AuthHelper;
import com.cdez.sg_cdez_api.util.ValidationHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class ConsultaServiceImpl implements ConsultaService {
    private final ConsultaRepository REPOSITORY;
    private final AuthHelper AUTH_HELPER;
    private final ValidationHelper VALIDATION_HELPER;

    @Override
    public PageResponse<ConsultaResponse> listarConsultasFiltradas(ConsultaFiltro filtros, Pageable pageable) {
        if(filtros.adultoId() == null){
            throw new RuntimeException("Id de adulto mayor no puede ser vacío");
        }

        Specification<Consulta> spec = Specification.unrestricted();
        spec = spec.and(ConsultaSpecs.hasAdultoId(filtros.adultoId()));

        if(filtros.personalView() != null){
            spec = spec.and(ConsultaSpecs.hasCreatedById(AUTH_HELPER.obtenerUsuarioAutenticado().getPersonalId()));
        }

        if(filtros.especialidad() != null){
            spec = spec.and(ConsultaSpecs.hasEspecialidad(filtros.especialidad()));
        }

        if(filtros.nombreCreadoPor() != null){
            spec = spec.and(ConsultaSpecs.containsName(filtros.nombreCreadoPor()));
        }

        Page<Consulta> consultaPage = REPOSITORY.findAll(spec, pageable);
        VALIDATION_HELPER.checkPaginationBounds(consultaPage, pageable);

        Page<ConsultaResponse> responsePage = consultaPage.map(this::mapDTO);
        return new PageResponse<>(responsePage);
    }

    @Override
    public ConsultaResponse obtenerConsultaPorId(int id) {
        return null;
    }

    private ConsultaResponse mapDTO(Consulta consulta){
        return new ConsultaResponse(
                consulta.getConsultaId(),
                consulta.getAdultoMayor().getNombreCompleto(),
                consulta.getMotivo(),
                consulta.getTipoIntervencion(),
                consulta.getDescripcion(),
                consulta.getDiagnostico(),
                consulta.getRecomendaciones(),
                consulta.getNotas(),
                consulta.getReferencia().getPersonalId(),
                consulta.getCreatedBy().getNombreCompleto(),
                consulta.getCreatedBy().getPersonalId(),
                consulta.getCreatedAt()
        );
    }
}
