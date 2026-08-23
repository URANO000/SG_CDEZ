package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.MedicamentoCreateRequest;
import com.cdez.sg_cdez_api.dto.request.MedicamentoUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.MedicamentoResponse;
import com.cdez.sg_cdez_api.entity.AdultoMayor;
import com.cdez.sg_cdez_api.entity.Medicamento;
import com.cdez.sg_cdez_api.repository.AdultoMayorRepository;
import com.cdez.sg_cdez_api.repository.MedicamentoRepository;
import com.cdez.sg_cdez_api.service.MedicamentoService;
import com.cdez.sg_cdez_api.util.AuthHelper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
    public List<MedicamentoResponse> crearMedicamentos(List<MedicamentoCreateRequest> requests, UUID adultoId) {
        List<MedicamentoResponse> medicamentosNuevos = new ArrayList<>();
        AdultoMayor adultoMayor = ADULTO_REPOSITORY.findById(adultoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Adulto indicado no existe."
                ));
        for(var medicamento : requests){
            Medicamento medicamentoNuevo = new Medicamento();

            medicamentoNuevo.setAdulto(adultoMayor);
            medicamentoNuevo.setNombre(medicamento.nombre());
            medicamentoNuevo.setDosis(medicamento.dosis());
            medicamentoNuevo.setHorario(medicamento.horario());
            medicamentoNuevo.setTipo(medicamento.tipo());
            medicamentoNuevo.setObservaciones(medicamento.observaciones());
            medicamentoNuevo.setCreatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());
            medicamentoNuevo.setCreatedAt(LocalDateTime.now(Clock.systemUTC()));
            medicamentoNuevo.setActivo(true);

            Medicamento medicamentoCreado = REPOSITORY.save(medicamentoNuevo);
            medicamentosNuevos.add(mapDTO(medicamentoCreado));
        }
        return medicamentosNuevos;
    }

    @Override
    public List<MedicamentoResponse> actualizarMedicamentos(List<MedicamentoUpdateRequest> requests, UUID adultoId) {
        List<MedicamentoResponse> medicamentosActualizados = new ArrayList<>();
        for(var medicamento : requests){
            Medicamento medicamentoAnterior = REPOSITORY.findById(medicamento.medicamentoId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Medicamento indicado no existe."
                    ));

            medicamentoAnterior.setNombre(medicamento.nombre());
            medicamentoAnterior.setDosis(medicamento.dosis());
            medicamentoAnterior.setHorario(medicamento.horario());
            medicamentoAnterior.setTipo(medicamento.tipo());
            medicamentoAnterior.setObservaciones(medicamento.observaciones());
            medicamentoAnterior.setUpdatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());
            medicamentoAnterior.setUpdatedAt(LocalDateTime.now(Clock.systemUTC()));
        }
        return medicamentosActualizados;
    }

    @Override
    public void desactivarMedicamentos(List<UUID> medicamentos) {
        for(var medicamento:medicamentos){
            Medicamento medicamentoADesactivar = REPOSITORY.findById(medicamento)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Medicamento indicado no existe."
                    ));
            medicamentoADesactivar.setActivo(false);
            REPOSITORY.save(medicamentoADesactivar);
        }
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
