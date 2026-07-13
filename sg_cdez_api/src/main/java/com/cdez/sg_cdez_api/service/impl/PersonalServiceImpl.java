package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.PageResponse;
import com.cdez.sg_cdez_api.dto.response.PersonalResponse;
import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.repository.*;
import com.cdez.sg_cdez_api.service.*;
import com.cdez.sg_cdez_api.util.AuthHelper;
import com.cdez.sg_cdez_api.util.Exceptions.PageOutOfBoundsException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PersonalServiceImpl implements PersonalService {
    private final PersonalRepository REPOSITORY;
    private final AuthHelper AUTH_HELPER;
    private final RolRepository ROL_REPOSITORY;
    private final PasswordEncoder ENCODER;
    private final EmailService EMAIL_SERVICE;
    private final ContactoService CONTACTO_SERVICE;

    @Override
    public PageResponse<PersonalResponse> listarPersonal(@PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<Personal> personalPage = REPOSITORY.findAll(pageable);

        //Manejo de excepciones
        if(personalPage.getTotalElements() > 0 && pageable.getPageNumber() >= personalPage.getTotalPages()){
            throw new PageOutOfBoundsException(
                    String.format("Número de página %d está fuera de rango. Páginas totales: %d", pageable.getPageNumber(), personalPage.getTotalPages())
            );
        }

        Page<PersonalResponse> responsePage = personalPage.map(this::mapDTO);
        return new PageResponse<>(responsePage);
    }

    @Override
    public PersonalResponse obtenerPersonalPorId(UUID id) {
        return mapDTO(obtenerPersonalCheck(id));
    }

    @Transactional
    @Override
    public PersonalResponse crearPersonal(PersonalCreateRequest request){
        // Validaciones
        if(!AUTH_HELPER.isUsuarioAdmin()){
            throw new RuntimeException("Sólo un usuario administrador puede crear nuevo personal.");
        }
        if(REPOSITORY.existsByUsuario(request.usuario())){
            throw new RuntimeException("Ya existe un usuario con ese correo.");
        }

        // Contraseña temporal
        String passwordTemporal = AuthHelper.generarPassword(12);

        Personal personalNuevo = new Personal();

        Rol rol = ROL_REPOSITORY.findById(request.rol()).orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        System.out.println("Este es el rol" + rol);
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
        personalNuevo.setContrasena(ENCODER.encode(passwordTemporal));
        personalNuevo.setActivo(true); // Por defecto
        personalNuevo.setCreatedAt(LocalDateTime.now(Clock.systemUTC()));
        personalNuevo.setCreatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());

        Personal personalGuardado = REPOSITORY.save(personalNuevo);

        //Crear contactos nuevos (o contacto nuevo)
        CONTACTO_SERVICE.crearContactoPersonal(request.contactos(), personalGuardado);

        // Enviar correo con contraseña temporal
        EMAIL_SERVICE.enviarCredenciales(personalGuardado.getUsuario(), passwordTemporal);

        return mapDTO(personalGuardado);
    }

    @Override
    public PersonalResponse actualizarPersonal(UUID id, PersonalActualizarRequest request){
        if(!AUTH_HELPER.isUsuarioAdmin()){
            throw new RuntimeException("Sólo un usuario administrador puede editar el personal.");
        }

        Personal personalViejo = obtenerPersonalCheck(id);

        Rol rol = ROL_REPOSITORY.findById(request.rol()).orElseThrow(() -> new RuntimeException("Rol no encontrado"));
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
        personalViejo.setUpdatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());
        personalViejo.setUpdatedAt(LocalDateTime.now(Clock.systemUTC()));

        Personal personalNuevo = REPOSITORY.save(personalViejo);
        return mapDTO(personalNuevo);
    }

    @Override
    public PersonalResponse activarPersonal(UUID id){
        if(!AUTH_HELPER.isUsuarioAdmin()){
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
        if(!AUTH_HELPER.isUsuarioAdmin()){
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
                personal.getPersonalId(),
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
                personal.getCreatedBy() != null ? personal.getCreatedBy().getUsuario() : null,
                personal.getCreatedAt(),
                personal.getUpdatedBy() != null ? personal.getUpdatedBy().getUsuario() : null ,
                personal.getUpdatedAt(),

                CONTACTO_SERVICE.listarContactoPorPersonal(personal)
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
