package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.AuditoriaFiltroRequest;
import com.cdez.sg_cdez_api.dto.response.AuditoriaResponse;
import com.cdez.sg_cdez_api.entity.Auditoria;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.AuditoriaRepository;
import com.cdez.sg_cdez_api.repository.PersonalRepository;
import com.cdez.sg_cdez_api.repository.specifications.AuditoriaSpecs;
import com.cdez.sg_cdez_api.service.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditoriaServiceImpl implements AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;
    private final PersonalRepository personalRepository;

    @Override
    @Transactional
    public void registrarAccion(
            String accion,
            String modulo,
            String entidadAfectada,
            String registroAfectadoId,
            String descripcion
    ) {
        Personal usuarioAutenticado = obtenerUsuarioAutenticado();

        Auditoria auditoria = new Auditoria();
        auditoria.setUsuario(usuarioAutenticado);
        auditoria.setAccion(accion);
        auditoria.setModulo(modulo);
        auditoria.setEntidadAfectada(entidadAfectada);
        auditoria.setRegistroAfectadoId(registroAfectadoId);
        auditoria.setDescripcion(descripcion);
        auditoria.setCreatedAt(LocalDateTime.now());

        auditoriaRepository.save(auditoria);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditoriaResponse> consultarAuditorias(AuditoriaFiltroRequest filtro) {
        AuditoriaFiltroRequest filtroSeguro = filtro != null
                ? filtro
                : new AuditoriaFiltroRequest(null, null, null, null, null, null);

        return auditoriaRepository
                .findAll(
                        AuditoriaSpecs.conFiltros(filtroSeguro),
                        Sort.by(Sort.Direction.DESC, "createdAt")
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private Personal obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "No se encontró un usuario autenticado."
            );
        }

        String usuario = authentication.getName();

        return personalRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "El usuario autenticado no está registrado como personal."
                ));
    }

    private AuditoriaResponse mapToResponse(Auditoria auditoria) {
        Personal usuario = auditoria.getUsuario();

        return new AuditoriaResponse(
                auditoria.getAuditoriaId(),
                usuario.getPersonalId(),
                usuario.getUsuario(),
                obtenerNombreCompleto(usuario),
                auditoria.getAccion(),
                auditoria.getModulo(),
                auditoria.getEntidadAfectada(),
                auditoria.getRegistroAfectadoId(),
                auditoria.getDescripcion(),
                auditoria.getCreatedAt()
        );
    }

    private String obtenerNombreCompleto(Personal personal) {
        StringBuilder nombreCompleto = new StringBuilder();

        agregarParteNombre(nombreCompleto, personal.getPrimerNombre());
        agregarParteNombre(nombreCompleto, personal.getSegundoNombre());
        agregarParteNombre(nombreCompleto, personal.getPrimerApellido());
        agregarParteNombre(nombreCompleto, personal.getSegundoApellido());

        return nombreCompleto.toString().trim();
    }

    private void agregarParteNombre(StringBuilder nombreCompleto, String parte) {
        if (parte != null && !parte.isBlank()) {
            if (!nombreCompleto.isEmpty()) {
                nombreCompleto.append(" ");
            }

            nombreCompleto.append(parte.trim());
        }
    }
}