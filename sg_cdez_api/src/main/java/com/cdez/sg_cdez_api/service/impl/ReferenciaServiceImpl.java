package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.ReferenciaCreateRequest;
import com.cdez.sg_cdez_api.entity.Consulta;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.entity.Referencia;
import com.cdez.sg_cdez_api.repository.PersonalRepository;
import com.cdez.sg_cdez_api.repository.ReferenciaRepository;
import com.cdez.sg_cdez_api.service.EmailService;
import com.cdez.sg_cdez_api.service.ReferenciaService;
import com.cdez.sg_cdez_api.util.AuthHelper;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class ReferenciaServiceImpl implements ReferenciaService {
    private final AuthHelper AUTH_HELPER;
    private final PersonalRepository PERSONAL_REPOSITORY;
    private final ReferenciaRepository REPOSITORY;
    private final EmailService EMAIL_SERVICE;
    @Override
    @Transactional
    public void crearReferencia(Consulta consulta, ReferenciaCreateRequest request) {
        Personal personalEmisor = AUTH_HELPER.obtenerUsuarioAutenticado();
        Personal personalReceptor = PERSONAL_REPOSITORY.findById(request.receptorId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Personal receptor indicado no se encontró."
                ));

        // Validaciones
        if(request.mensaje() == null || request.mensaje().isBlank()){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El mensaje de la referencia no puede estar vacío."
            );
        }

        if(personalEmisor.getPersonalId().equals(request.receptorId())){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede hacer una referencia a sí mismo."
            );
        }

        Referencia referencia = new Referencia();
        referencia.setEmisor(personalEmisor);
        referencia.setReceptor(personalReceptor);
        referencia.setConsulta(consulta);
        referencia.setMensaje(request.mensaje());
        referencia.setCreatedAt(LocalDateTime.now(Clock.systemUTC()));

        REPOSITORY.save(referencia);

        EMAIL_SERVICE.enviarCorreoReferencia(
                personalReceptor.getUsuario(),
                personalReceptor.getNombreCompleto(),
                personalEmisor.getNombreCompleto(),
                personalEmisor.getEspecialidad().getLabel(),
                consulta.getAdultoMayor().getNombreCompleto(),
                request.mensaje(),
                consulta.getConsultaId().toString()
        );

    }
}
