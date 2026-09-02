package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.ConsultaPsychActualizarRequest;
import com.cdez.sg_cdez_api.dto.request.ConsultaPsychCreateRequest;
import com.cdez.sg_cdez_api.entity.Consulta;
import com.cdez.sg_cdez_api.entity.ConsultaPsych;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.ConsultaPsychRepository;
import com.cdez.sg_cdez_api.service.ConsultaPsychService;
import com.cdez.sg_cdez_api.service.ConsultaService;
import com.cdez.sg_cdez_api.service.ReferenciaService;
import com.cdez.sg_cdez_api.service.TamizajeService;
import com.cdez.sg_cdez_api.util.AuthHelper;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@AllArgsConstructor
public class ConsultaPsychServiceImpl implements ConsultaPsychService {
    private final ConsultaPsychRepository REPOSITORY;
    private final TamizajeService TAMIZAJE_SERVICE;
    private final AuthHelper AUTH_HELPER;
    private final ReferenciaService REFERENCIA_SERVICE;
    private final ConsultaService CONSULTA_SERVICE;

    @Override
    @Transactional
    public void crearConsultaPsych(ConsultaPsychCreateRequest request) {
        validarEspecialidad(AUTH_HELPER.obtenerUsuarioAutenticado());

        ConsultaPsych consultaPsych = new ConsultaPsych();
        Consulta consulta = CONSULTA_SERVICE.crearConsultaEntity(request.consultaGeneral());

        consultaPsych.setConsulta(consulta);

        ConsultaPsych consultaPsychGuardada = REPOSITORY.save(consultaPsych);
        TAMIZAJE_SERVICE.crearTamizajesPsych(request.tamizajes(), consultaPsychGuardada);

        if(request.consultaGeneral().referencia() != null){
            REFERENCIA_SERVICE.crearReferencia(
                    consulta,
                    request.consultaGeneral().referencia()
            );
        }
    }

    @Override
    @Transactional
    public void actualizarConsultaPsych(UUID id, ConsultaPsychActualizarRequest request) {
        validarEspecialidad(AUTH_HELPER.obtenerUsuarioAutenticado());

        ConsultaPsych consultaPsychVieja = obtenerConsultaPsychCheck(id);
        UUID consultaId = consultaPsychVieja.getConsulta().getConsultaId();

        CONSULTA_SERVICE.actualizarConsulta(request.consulta(), consultaId);
        ConsultaPsych consultaPsychActualizada = REPOSITORY.save(consultaPsychVieja);

        if(request.tamizajes() != null){
            TAMIZAJE_SERVICE.actualizarTamizajesPsych(request.tamizajes(), consultaPsychActualizada);
        }
    }

    @Override
    @Transactional
    public void desactivarConsultaPsych(UUID id) {
        ConsultaPsych consultaPsych = obtenerConsultaPsychCheck(id);
        CONSULTA_SERVICE.desactivarConsulta(consultaPsych.getConsulta().getConsultaId());
        validarEspecialidad(AUTH_HELPER.obtenerUsuarioAutenticado());

        REPOSITORY.save(consultaPsych);
    }

    private ConsultaPsych obtenerConsultaPsychCheck(UUID id){
        return REPOSITORY.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Consulta Psicológica indicada no encontrada."
                ));
    }

    private void validarEspecialidad(Personal personal){
        String especialidad = personal.getEspecialidad() != null
                ? personal.getEspecialidad().getLabel()
                : null;
        if(especialidad == null){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Personal no tiene especialidad."
            );
        }

        if(!especialidad.equals("Psicología")){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Sólo personal de psicología puede realizar acciones sobre consulta nutricional."
            );
        }
    }
}
