package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.AuthRepository;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorRequest;
import com.cdez.sg_cdez_api.dto.response.AdultoMayorResponse;
import com.cdez.sg_cdez_api.entity.AdultoMayor;
import com.cdez.sg_cdez_api.repository.AdultoMayorRepository;
import com.cdez.sg_cdez_api.service.AdultoMayorService;
import org.springframework.stereotype.Service;
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
        return adultoMayorRepository.findAll()
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

        Personal usuarioCreador = authRepository.findByUsuario("example@gmail.com")
                .orElseThrow(() -> new RuntimeException("Usuario creador de prueba no encontrado"));

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
    public AdultoMayorResponse actualizarAdultoMayor(UUID id, AdultoMayorRequest request) {

        AdultoMayor adultoMayor = adultoMayorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adulto mayor no encontrado"));

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

        adultoMayor.setUpdatedAt(java.time.LocalDateTime.now());

        AdultoMayor adultoActualizado = adultoMayorRepository.save(adultoMayor);

        return mapToResponse(adultoActualizado);
    }
}