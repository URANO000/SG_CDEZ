package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.AuthRepository;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorRequest;
import com.cdez.sg_cdez_api.dto.response.AdultoMayorResponse;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorUpdateRequest;
import com.cdez.sg_cdez_api.entity.AdultoMayor;
import com.cdez.sg_cdez_api.repository.AdultoMayorRepository;
import com.cdez.sg_cdez_api.service.AdultoMayorService;
import org.springframework.stereotype.Service;
import com.cdez.sg_cdez_api.entity.CustomUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorDesactivarRequest;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorFallecimientoRequest;
import java.util.UUID;

import java.util.List;

@Service
public class AdultoMayorServiceImpl implements AdultoMayorService {

    private final AdultoMayorRepository adultoMayorRepository;
    private final AuthRepository authRepository;

    public AdultoMayorServiceImpl(AdultoMayorRepository adultoMayorRepository, AuthRepository authRepository) {
        this.adultoMayorRepository = adultoMayorRepository;
        this.authRepository = authRepository;
    }
    @Override
    public List<AdultoMayorResponse> listarAdultosMayores() {
        return adultoMayorRepository.findByActivoTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Override
    public List<AdultoMayorResponse> listarAdultosMayoresInactivos() {
        return adultoMayorRepository.findByActivoFalseAndFechaFallecimientoIsNull()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Override
    public List<AdultoMayorResponse> listarAdultosMayoresFallecidos() {
        return adultoMayorRepository.findByFechaFallecimientoIsNotNull()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private AdultoMayorResponse mapToResponse(AdultoMayor adultoMayor) {
        return new AdultoMayorResponse(
                adultoMayor.getAdultoId(),
                adultoMayor.getTipoIdentificacion(),
                adultoMayor.getIdentificacion(),
                adultoMayor.getPrimerNombre(),
                adultoMayor.getSegundoNombre(),
                adultoMayor.getPrimerApellido(),
                adultoMayor.getSegundoApellido(),
                adultoMayor.getNacionalidad(),
                adultoMayor.getFechaNacimiento(),
                adultoMayor.getSexo(),
                adultoMayor.getDireccion(),
                adultoMayor.getEscolaridad(),
                adultoMayor.getGrupoFamiliar(),
                adultoMayor.isPension(),
                adultoMayor.getFuncionalidadFisica(),
                adultoMayor.isAyudaBiomecanica(),
                adultoMayor.getFechaIngreso(),
                adultoMayor.isActivo()
        );
    }
    @Override
    public List<AdultoMayorResponse> buscarAdultosMayores(String texto) {

        if (texto == null || texto.isBlank()) {
            return listarAdultosMayores();
        }

        return adultoMayorRepository
                .findByPrimerNombreContainingIgnoreCaseOrSegundoNombreContainingIgnoreCaseOrPrimerApellidoContainingIgnoreCaseOrSegundoApellidoContainingIgnoreCaseOrIdentificacionContainingIgnoreCase(
                        texto,
                        texto,
                        texto,
                        texto,
                        texto
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AdultoMayorResponse crearAdultoMayor(AdultoMayorRequest request) {

        AdultoMayor adultoMayor = new AdultoMayor();

        adultoMayor.setTipoIdentificacion(request.tipoIdentificacion());
        adultoMayor.setIdentificacion(request.identificacion());
        adultoMayor.setPrimerNombre(request.primerNombre());
        adultoMayor.setSegundoNombre(request.segundoNombre());
        adultoMayor.setPrimerApellido(request.primerApellido());
        adultoMayor.setSegundoApellido(request.segundoApellido());
        adultoMayor.setNacionalidad(request.nacionalidad());
        adultoMayor.setFechaNacimiento(request.fechaNacimiento());
        adultoMayor.setSexo(request.sexo());
        adultoMayor.setDireccion(request.direccion());
        adultoMayor.setEscolaridad(request.escolaridad());
        adultoMayor.setGrupoFamiliar(request.grupoFamiliar());
        adultoMayor.setPension(request.pension());
        adultoMayor.setFuncionalidadFisica(request.funcionalidadFisica());
        adultoMayor.setAyudaBiomecanica(request.ayudaBiomecanica());
        adultoMayor.setFechaIngreso(request.fechaIngreso());

        adultoMayor.setActivo(true);
        adultoMayor.setCreatedAt(java.time.LocalDateTime.now());

        Personal usuarioCreador = obtenerUsuarioAutenticado();
        adultoMayor.setCreatedBy(usuarioCreador);

        AdultoMayor adultoGuardado = adultoMayorRepository.save(adultoMayor);

        return mapToResponse(adultoGuardado);
    }
    @Override
    public AdultoMayorResponse obtenerAdultoMayorPorId(UUID id) {

        AdultoMayor adultoMayor = adultoMayorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adulto mayor no encontrado"));

        return mapToResponse(adultoMayor);
    }
    @Override
    public AdultoMayorResponse actualizarAdultoMayor(UUID id, AdultoMayorUpdateRequest request) {

        AdultoMayor adultoMayor = adultoMayorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adulto mayor no encontrado"));

        adultoMayor.setDireccion(request.direccion());
        adultoMayor.setEscolaridad(request.escolaridad());
        adultoMayor.setGrupoFamiliar(request.grupoFamiliar());
        adultoMayor.setFuncionalidadFisica(request.funcionalidadFisica());
        adultoMayor.setAyudaBiomecanica(request.ayudaBiomecanica());

        adultoMayor.setUpdatedAt(java.time.LocalDateTime.now());

        Personal usuarioActualizador = obtenerUsuarioAutenticado();
        adultoMayor.setUpdatedBy(usuarioActualizador);

        AdultoMayor adultoActualizado = adultoMayorRepository.save(adultoMayor);

        return mapToResponse(adultoActualizado);
    }
    private Personal obtenerUsuarioAutenticado() {
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        if (!(principal instanceof CustomUserDetails userDetails)) {
            throw new RuntimeException("Usuario autenticado no válido");
        }

        return authRepository.findByPersonalId(userDetails.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));
    }
    
    @Override
    public AdultoMayorResponse desactivarAdultoMayor(UUID id, AdultoMayorDesactivarRequest request) {

        AdultoMayor adultoMayor = adultoMayorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adulto mayor no encontrado"));

        if (adultoMayor.getFechaFallecimiento() != null) {
            throw new RuntimeException("No se puede desactivar un adulto mayor fallecido");
        }

        adultoMayor.setActivo(false);
        adultoMayor.setFechaRetiro(request.fechaRetiro());
        adultoMayor.setMotivoRetiro(request.motivoRetiro());
        adultoMayor.setUpdatedAt(java.time.LocalDateTime.now());

        Personal usuarioActualizador = obtenerUsuarioAutenticado();
        adultoMayor.setUpdatedBy(usuarioActualizador);

        AdultoMayor actualizado = adultoMayorRepository.save(adultoMayor);

        return mapToResponse(actualizado);
    }
    @Override
    public AdultoMayorResponse activarAdultoMayor(UUID id) {

        AdultoMayor adultoMayor = adultoMayorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adulto mayor no encontrado"));

        if (adultoMayor.getFechaFallecimiento() != null) {
            throw new RuntimeException("No se puede activar un adulto mayor fallecido");
        }

        adultoMayor.setActivo(true);
        adultoMayor.setFechaRetiro(null);
        adultoMayor.setMotivoRetiro(null);
        adultoMayor.setUpdatedAt(java.time.LocalDateTime.now());

        Personal usuarioActualizador = obtenerUsuarioAutenticado();
        adultoMayor.setUpdatedBy(usuarioActualizador);

        AdultoMayor actualizado = adultoMayorRepository.save(adultoMayor);

        return mapToResponse(actualizado);
    }
    @Override
    public AdultoMayorResponse registrarFallecimiento(UUID id, AdultoMayorFallecimientoRequest request) {

        AdultoMayor adultoMayor = adultoMayorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adulto mayor no encontrado"));

        adultoMayor.setActivo(false);
        adultoMayor.setFechaFallecimiento(request.fechaFallecimiento());
        adultoMayor.setMotivoRetiro(request.motivoRetiro());
        adultoMayor.setUpdatedAt(java.time.LocalDateTime.now());

        Personal usuarioActualizador = obtenerUsuarioAutenticado();
        adultoMayor.setUpdatedBy(usuarioActualizador);

        AdultoMayor actualizado = adultoMayorRepository.save(adultoMayor);

        return mapToResponse(actualizado);
    }
}