package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.response.*;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.entity.enums.Especialidad;
import com.cdez.sg_cdez_api.repository.AdultoMayorRepository;
import com.cdez.sg_cdez_api.repository.ConsultaRepository;
import com.cdez.sg_cdez_api.repository.PersonalRepository;
import com.cdez.sg_cdez_api.service.DashboardService;
import com.cdez.sg_cdez_api.util.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {
    private final AdultoMayorRepository adultoRepository;
    private final PersonalRepository personalRepository;
    private final ConsultaRepository consultaRepository;
    private final AuthHelper authHelper;
    @Override
    public DashboardResponse obtenerDashboard() {
        LocalDateTime inicioMes = LocalDate.now()
                .withDayOfMonth(1)
                .atStartOfDay();

        List<ConsultasPorEspecialidadResponse> porEspecialidad =
                consultaRepository
                        .contarConsultasActivasPorEspecialidad()
                        .stream()
                        .map(resultado ->
                                new ConsultasPorEspecialidadResponse(
                                        formatearEspecialidad(
                                                resultado.getEspecialidad()
                                        ),
                                        resultado.getCantidad()
                                )
                        )
                        .toList();

        return new DashboardResponse(
                adultoRepository.countByActivoTrue(),
                personalRepository.countByActivoTrue(),
                consultaRepository.countByActivoTrue(),
                consultaRepository
                        .countByActivoTrueAndCreatedAtGreaterThanEqual(inicioMes),
                porEspecialidad
        );
    }

    private String formatearEspecialidad(Especialidad especialidad) {
        if (especialidad == null) {
            return "Sin especialidad";
        }

        String texto = especialidad.getLabel()
                .toLowerCase(Locale.ROOT)
                .replace("_", " ");

        return Character.toUpperCase(texto.charAt(0))
                + texto.substring(1);
    }

    @Override
    public PersonalDashboardResponse obtenerDashboardPersonal(
    ) {
        LocalDate hoy = LocalDate.now();

        UUID personalId = authHelper.obtenerUsuarioAutenticado().getPersonalId();

        LocalDateTime inicioDia = hoy.atStartOfDay();
        LocalDateTime finDia = hoy.plusDays(1).atStartOfDay();

        LocalDateTime inicioMes = hoy
                .withDayOfMonth(1)
                .atStartOfDay();

        List<ConsultasPorTipoResponse> consultasPorTipo =
                consultaRepository
                        .contarPorTipoConsulta(personalId)
                        .stream()
                        .map(resultado ->
                                new ConsultasPorTipoResponse(
                                        resultado.getTipoConsulta(),
                                        resultado.getCantidad()
                                )
                        )
                        .toList();

        List<ConsultaRecienteResponse> consultasRecientes =
                consultaRepository
                        .buscarConsultasRecientes(
                                personalId,
                                PageRequest.of(0, 5)
                        )
                        .stream()
                        .map(this::mapearConsultaReciente)
                        .toList();

        return new PersonalDashboardResponse(
                consultaRepository
                        .countByActivoTrueAndCreatedByPersonalId(personalId),

                consultaRepository
                        .countByActivoTrueAndCreatedByPersonalIdAndCreatedAtGreaterThanEqual(
                                personalId,
                                inicioMes
                        ),

                consultaRepository
                        .countByActivoTrueAndCreatedByPersonalIdAndCreatedAtBetween(
                                personalId,
                                inicioDia,
                                finDia
                        ),

                consultaRepository.contarAdultosAtendidos(personalId),

                consultasPorTipo,

                consultasRecientes
        );
    }

    private ConsultaRecienteResponse mapearConsultaReciente(
            ConsultaRecienteProjection consulta
    ) {
        String nombreCompleto = Stream.of(
                        consulta.getPrimerNombre(),
                        consulta.getSegundoNombre(),
                        consulta.getPrimerApellido(),
                        consulta.getSegundoApellido()
                )
                .filter(nombre ->
                        nombre != null && !nombre.isBlank()
                )
                .collect(Collectors.joining(" "));

        return new ConsultaRecienteResponse(
                consulta.getConsultaId(),
                consulta.getAdultoId(),
                nombreCompleto,
                consulta.getTipoConsulta(),
                consulta.getMotivo(),
                consulta.getFecha()
        );
    }

    @Override
    public AyudanteDashboardResponse obtenerDashboardAyudante() {
        LocalDate hoy = LocalDate.now();

        LocalDateTime inicioHoy = hoy.atStartOfDay();
        LocalDateTime inicioManana = hoy.plusDays(1).atStartOfDay();

        LocalDateTime inicioMes = hoy
                .withDayOfMonth(1)
                .atStartOfDay();

        List<ConsultasPorTipoResponse> consultasPorTipo =
                consultaRepository
                        .contarConsultasActivasPorTipo()
                        .stream()
                        .map(resultado ->
                                new ConsultasPorTipoResponse(
                                        resultado.getTipoConsulta(),
                                        resultado.getCantidad()
                                )
                        )
                        .toList();

        List<ConsultaRecienteResponse> consultasRecientes =
                consultaRepository
                        .buscarConsultasRecientes(
                                PageRequest.of(0, 5)
                        )
                        .stream()
                        .map(this::mapearConsultaReciente)
                        .toList();

        return new AyudanteDashboardResponse(
                adultoRepository.countByActivoTrue(),

                adultoRepository.countByActivoFalse(),

                adultoRepository.countByActivoTrueAndCreatedAtGreaterThanEqual(
                        inicioMes
                ),

                consultaRepository.countByActivoTrue(),

                consultaRepository
                        .countByActivoTrueAndCreatedAtGreaterThanEqual(
                                inicioMes
                        ),

                consultaRepository
                        .countByActivoTrueAndCreatedAtBetween(
                                inicioHoy,
                                inicioManana
                        ),

                consultasPorTipo,

                consultasRecientes
        );
    }



}
