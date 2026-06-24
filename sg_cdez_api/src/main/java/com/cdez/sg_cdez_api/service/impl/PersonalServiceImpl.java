package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.PersonalActualizarRequest;
import com.cdez.sg_cdez_api.dto.request.PersonalCreateRequest;
import com.cdez.sg_cdez_api.dto.response.PersonalResponse;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.entity.Rol;
import com.cdez.sg_cdez_api.repository.PersonalRepository;
import com.cdez.sg_cdez_api.repository.RolRepository;
import com.cdez.sg_cdez_api.service.PersonalService;
import com.cdez.sg_cdez_api.util.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PersonalServiceImpl implements PersonalService {
    private final PersonalRepository REPOSITORY;
    private final AuthHelper AUTHHELPER;
    private final RolRepository ROLREPOSITORY;

    @Override
    public List<PersonalResponse> listarPersonal() {
        return REPOSITORY.findAll().stream().map(this::mapDTO).toList();
    }

    @Override
    public PersonalResponse obtenerPersonalPorId(UUID id) {
        return mapDTO(obtenerPersonalCheck(id));
    }

    @Override
    public PersonalResponse crearPersonal(PersonalCreateRequest request){
        if(!AUTHHELPER.isUsuarioAdmin()){
            throw new RuntimeException("Sólo un usuario administrador puede crear nuevo personal.");
        }

        Personal personalNuevo = new Personal();

        Rol rol = ROLREPOSITORY.findById(request.rol()).orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        personalNuevo.setRol(rol);
        personalNuevo.setEspecialidad(request.especialidad());
        personalNuevo.setTipoIdentificacion(request.tipoIdentificacion());
        personalNuevo.setIdentificacion(request.identificacion());
        personalNuevo.setPrimerNombre(request.primerNombre());
        personalNuevo.setSegundoNombre(request.segundoNombre());
        personalNuevo.setPrimerApellido(request.primerApellido());
        personalNuevo.setSegundoApellido(request.segundoApellido());
        personalNuevo.setDireccion(request.direccion());
        personalNuevo.setCarnet(request.carnet());
        personalNuevo.setUsuario(request.usuario());
        personalNuevo.setActivo(request.activo());
        personalNuevo.setCreatedAt(LocalDateTime.now(Clock.systemUTC()));
        personalNuevo.setCreatedBy(AUTHHELPER.obtenerUsuarioAutenticado());

        Personal personalGuardado = REPOSITORY.save(personalNuevo);
        return mapDTO(personalGuardado);
    }

    @Override
    public PersonalResponse actualizarPersonal(UUID id, PersonalActualizarRequest request){
        if(!AUTHHELPER.isUsuarioAdmin()){
            throw new RuntimeException("Sólo un usuario administrador puede editar el personal.");
        }

        Personal personalViejo = obtenerPersonalCheck(id);

        Rol rol = ROLREPOSITORY.findById(request.rol()).orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        personalViejo.setRol(rol);
        personalViejo.setEspecialidad(request.especialidad());
        personalViejo.setTipoIdentificacion(request.tipoIdentificacion());
        personalViejo.setIdentificacion(request.identificacion());
        personalViejo.setPrimerNombre(request.primerNombre());
        personalViejo.setSegundoNombre(request.segundoNombre());
        personalViejo.setPrimerApellido(request.primerApellido());
        personalViejo.setSegundoApellido(request.segundoApellido());
        personalViejo.setDireccion(request.direccion());
        personalViejo.setCarnet(request.carnet());
        personalViejo.setUsuario(request.usuario());
        personalViejo.setUpdatedBy(AUTHHELPER.obtenerUsuarioAutenticado());
        personalViejo.setUpdatedAt(LocalDateTime.now(Clock.systemUTC()));

        Personal personalNuevo = REPOSITORY.save(personalViejo);
        return mapDTO(personalNuevo);
    }

    @Override
    public PersonalResponse activarPersonal(UUID id){
        if(!AUTHHELPER.isUsuarioAdmin()){
            throw new RuntimeException("Sólo un usuario administrador puede activar el personal.");
        }

        Personal personal = obtenerPersonalCheck(id);
        if(personal.isActivo()){
            throw new RuntimeException("Personal ya es activo.");
        }
        personal.setActivo(true);
        REPOSITORY.save(personal);
        return mapDTO(personal);
    }

    @Override
    public PersonalResponse desactivarPersonal(UUID id){
        if(!AUTHHELPER.isUsuarioAdmin()){
            throw new RuntimeException("Sólo un usuario administrador puede desactivar el personal.");
        }

        Personal personal = obtenerPersonalCheck(id);
        if(!personal.isActivo()){
            throw  new RuntimeException("Personal ya es inactivo.");
        }
        personal.setActivo(false);
        REPOSITORY.save(personal);
        return mapDTO(personal);
    }

    //Mapper
    private PersonalResponse mapDTO(Personal personal){
        return new PersonalResponse(
                personal.getRol().getNombre(),
                personal.getEspecialidad(),
                personal.getTipoIdentificacion(),
                personal.getIdentificacion(),
                personal.getPrimerNombre(),
                personal.getSegundoNombre(),
                personal.getPrimerApellido(),
                personal.getSegundoApellido(),
                personal.getDireccion(),
                personal.getCarnet(),
                personal.getUsuario(),
                activoConversion(personal.isActivo()),
                personal.getUsuario(),
                personal.getCreatedAt(),
                personal.getUsuario(),
                personal.getUpdatedAt()
        );
    }

    //Activo bool a string
    private String activoConversion(boolean isActivo){
        if(isActivo){
            return "Activo";
        }

        return "Inactivo";
    }

    //Personal existe?
    private Personal obtenerPersonalCheck(UUID id){
        return REPOSITORY.findById(id)
                .orElseThrow(()-> new RuntimeException("Personal no encontrado."));
    }
}
