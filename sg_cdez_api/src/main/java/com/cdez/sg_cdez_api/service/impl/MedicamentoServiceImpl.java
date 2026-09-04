package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.MedicamentoResponse;
import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.repository.*;
import com.cdez.sg_cdez_api.service.AuditoriaService;
import com.cdez.sg_cdez_api.service.MedicamentoService;
import com.cdez.sg_cdez_api.util.AuthHelper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.*;
import java.util.*;

@Service
@AllArgsConstructor
public class MedicamentoServiceImpl implements MedicamentoService {
    private final MedicamentoRepository REPOSITORY;
    private final AdultoMayorRepository ADULTO_REPOSITORY;
    private final AuthHelper AUTH_HELPER;
    private final AuditoriaService AUDITORIA_SERVICE;

    private void registrarAuditoria(
            String accion,
            Medicamento medicamento,
            String descripcion
    ) {
        AUDITORIA_SERVICE.registrarAccion(
                accion,
                "MEDICAMENTO",
                "Medicamento",
                medicamento.getMedicamentoId().toString(),
                descripcion
        );
    }

    private void agregarCambioProtegido(
            Map<String, Object> cambios,
            String campo,
            Object anterior,
            Object nuevo
    ) {
        if (Objects.equals(anterior, nuevo)) {
            return;
        }

        Map<String, Object> detalle = new LinkedHashMap<>();
        detalle.put("anterior", "Valor clínico protegido");
        detalle.put("nuevo", "Valor clínico modificado");

        cambios.put(campo, detalle);
    }

    private void agregarCambio(
            Map<String, Object> cambios,
            String campo,
            Object anterior,
            Object nuevo
    ) {
        if (Objects.equals(anterior, nuevo)) {
            return;
        }

        Map<String, Object> detalle = new LinkedHashMap<>();
        detalle.put("anterior", anterior);
        detalle.put("nuevo", nuevo);

        cambios.put(campo, detalle);
    }

    @Override
    public List<MedicamentoResponse> listarMedicamentosPorAdulto(UUID adultoId) {
        AdultoMayor adultoMayor = ADULTO_REPOSITORY.findById(adultoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Adulto indicado no existe."
                ));
        return REPOSITORY.findByAdultoAndActivoTrue(adultoMayor).stream().map(this::mapDTO).toList();
    }

    @Override
    public MedicamentoResponse crearMedicamentos(MedicamentoCreateRequest request, UUID adultoId) {
        AdultoMayor adultoMayor = ADULTO_REPOSITORY.findById(adultoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Adulto indicado no existe."
                ));
        Medicamento medicamentoNuevo = new Medicamento();

        medicamentoNuevo.setAdulto(adultoMayor);
        medicamentoNuevo.setNombre(request.nombre());
        medicamentoNuevo.setDosis(request.dosis());
        medicamentoNuevo.setHorario(request.horario());
        medicamentoNuevo.setTipo(request.tipo());
        medicamentoNuevo.setObservaciones(request.observaciones());
        medicamentoNuevo.setCreatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());
        medicamentoNuevo.setCreatedAt(LocalDateTime.now(Clock.systemUTC()));
        medicamentoNuevo.setActivo(true);

        Medicamento medicamentoCreado = REPOSITORY.save(medicamentoNuevo);

        registrarAuditoria(
                "REGISTRAR_MEDICAMENTO",
                medicamentoCreado,
                "Se registró un medicamento en el expediente del adulto mayor: "
                        + medicamentoCreado
                        .getAdulto()
                        .getNombreCompleto()
                        + "."
        );

        return mapDTO(medicamentoCreado);
    }

    @Override
    public MedicamentoResponse actualizarMedicamentos(
            MedicamentoUpdateRequest request,
            UUID adultoId
    ) {
        Medicamento medicamentoAnterior =
                REPOSITORY.findById(request.medicamentoId())
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Medicamento indicado no existe."
                                )
                        );

        if (
                !medicamentoAnterior
                        .getAdulto()
                        .getAdultoId()
                        .equals(adultoId)
        ) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El medicamento no pertenece al adulto mayor indicado."
            );
        }

        verificarEdicionValida(medicamentoAnterior.getCreatedBy().getPersonalId());

        Map<String, Object> cambios = new LinkedHashMap<>();

        agregarCambioProtegido(
                cambios,
                "nombre",
                medicamentoAnterior.getNombre(),
                request.nombre()
        );

        agregarCambioProtegido(
                cambios,
                "dosis",
                medicamentoAnterior.getDosis(),
                request.dosis()
        );

        agregarCambioProtegido(
                cambios,
                "horario",
                medicamentoAnterior.getHorario(),
                request.horario()
        );

        agregarCambio(
                cambios,
                "tipo",
                medicamentoAnterior.getTipo(),
                request.tipo()
        );

        agregarCambioProtegido(
                cambios,
                "observaciones",
                medicamentoAnterior.getObservaciones(),
                request.observaciones()
        );

        medicamentoAnterior.setNombre(request.nombre());
        medicamentoAnterior.setDosis(request.dosis());
        medicamentoAnterior.setHorario(request.horario());
        medicamentoAnterior.setTipo(request.tipo());
        medicamentoAnterior.setObservaciones(request.observaciones());

        medicamentoAnterior.setUpdatedBy(
                AUTH_HELPER.obtenerUsuarioAutenticado()
        );

        medicamentoAnterior.setUpdatedAt(
                LocalDateTime.now(Clock.systemUTC())
        );

        Medicamento medicamentoActualizado =
                REPOSITORY.save(medicamentoAnterior);

        AUDITORIA_SERVICE.registrarAccion(
                "ACTUALIZAR_MEDICAMENTO",
                "MEDICAMENTO",
                "Medicamento",
                medicamentoActualizado
                        .getMedicamentoId()
                        .toString(),
                cambios.isEmpty()
                        ? "Se procesó una actualización de medicamento sin cambios."
                        : "Se actualizó un medicamento del expediente del adulto mayor: "
                        + medicamentoActualizado
                        .getAdulto()
                        .getNombreCompleto()
                        + ".",
                cambios.isEmpty() ? null : cambios
        );

        return mapDTO(medicamentoActualizado);
    }

    @Override
    public void desactivarMedicamentos(UUID medicamentoId) {
        Medicamento medicamento =
                REPOSITORY.findById(medicamentoId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Medicamento indicado no existe."
                                )
                        );
        verificarEdicionValida(medicamento.getCreatedBy().getPersonalId());

        medicamento.setActivo(false);
        medicamento.setUpdatedBy(
                AUTH_HELPER.obtenerUsuarioAutenticado()
        );
        medicamento.setUpdatedAt(
                LocalDateTime.now(Clock.systemUTC())
        );

        Medicamento medicamentoDesactivado =
                REPOSITORY.save(medicamento);

        registrarAuditoria(
                "DESACTIVAR_MEDICAMENTO",
                medicamentoDesactivado,
                "Se desactivó un medicamento del expediente del adulto mayor: "
                        + medicamentoDesactivado
                        .getAdulto()
                        .getNombreCompleto()
                        + "."
        );
    }

    @Override
    public void activarMedicamentos(UUID medicamentoId) {
        Medicamento medicamento =
                REPOSITORY.findById(medicamentoId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Medicamento indicado no existe."
                                )
                        );
        verificarEdicionValida(medicamento.getCreatedBy().getPersonalId());

        medicamento.setActivo(true);
        medicamento.setUpdatedBy(
                AUTH_HELPER.obtenerUsuarioAutenticado()
        );
        medicamento.setUpdatedAt(
                LocalDateTime.now(Clock.systemUTC())
        );

        Medicamento medicamentoActivado =
                REPOSITORY.save(medicamento);

        registrarAuditoria(
                "ACTIVAR_MEDICAMENTO",
                medicamentoActivado,
                "Se activó un medicamento del expediente del adulto mayor: "
                        + medicamentoActivado
                        .getAdulto()
                        .getNombreCompleto()
                        + "."
        );
    }

    private MedicamentoResponse mapDTO(Medicamento medicamento){
        return new MedicamentoResponse(
                medicamento.getMedicamentoId(),
                medicamento.getAdulto().getNombreCompleto(),
                medicamento.getNombre(),
                medicamento.getDosis(),
                medicamento.getHorario(),
                medicamento.getTipo(),
                medicamento.getObservaciones(),
                medicamento.getCreatedBy().getPersonalId(),
                medicamento.getCreatedBy().getNombreCompleto(),
                medicamento.getCreatedAt(),
                medicamento.getUpdatedBy() != null ? medicamento.getUpdatedBy().getNombreCompleto() : null,
                medicamento.getUpdatedAt()

        );
    }

    private void verificarEdicionValida(UUID id){
        if(!AUTH_HELPER.obtenerUsuarioAutenticado().getPersonalId()
                .equals(id)){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Solo el creador de un medicamento puede editarlo."
            );
        }
    }

}


