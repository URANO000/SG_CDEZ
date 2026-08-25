package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.MedicamentoResponse;
import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.repository.*;
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

        return mapDTO(medicamentoCreado);
    }

    @Override
    public MedicamentoResponse actualizarMedicamentos(MedicamentoUpdateRequest request, UUID adultoId) {
        Medicamento medicamentoAnterior = REPOSITORY.findById(request.medicamentoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Medicamento indicado no existe."
                ));

        medicamentoAnterior.setNombre(request.nombre());
        medicamentoAnterior.setDosis(request.dosis());
        medicamentoAnterior.setHorario(request.horario());
        medicamentoAnterior.setTipo(request.tipo());
        medicamentoAnterior.setObservaciones(request.observaciones());
        medicamentoAnterior.setUpdatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());
        medicamentoAnterior.setUpdatedAt(LocalDateTime.now(Clock.systemUTC()));

        Medicamento medicamentosActualizados = REPOSITORY.save(medicamentoAnterior);

        return mapDTO(medicamentosActualizados);
    }

    @Override
    public void desactivarMedicamentos(UUID medicamento) {
        Medicamento medicamentoADesactivar = REPOSITORY.findById(medicamento)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Medicamento indicado no existe."
                ));
        medicamentoADesactivar.setActivo(false);
        REPOSITORY.save(medicamentoADesactivar);

    }

    public void activarMedicamentos(UUID medicamento) {
        Medicamento medicamentoADesactivar = REPOSITORY.findById(medicamento)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Medicamento indicado no existe."
                ));
        medicamentoADesactivar.setActivo(true);
        REPOSITORY.save(medicamentoADesactivar);

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
                medicamento.getCreatedBy().getNombreCompleto(),
                medicamento.getCreatedAt(),
                medicamento.getUpdatedBy() != null ? medicamento.getUpdatedBy().getNombreCompleto() : null,
                medicamento.getUpdatedAt()

        );
    }

}


