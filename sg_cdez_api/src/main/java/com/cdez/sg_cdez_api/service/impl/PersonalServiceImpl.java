package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.response.PersonalResponse;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.AuthRepository;
import com.cdez.sg_cdez_api.repository.PersonalRepository;
import com.cdez.sg_cdez_api.service.PersonalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonalServiceImpl implements PersonalService {
    private final PersonalRepository REPOSITORY;

//    @Override
//    public List<PersonalResponse> listarPersonal() {
//        return REPOSITORY.findAll().stream().map(this::);
//    }

//    @Override
//    public Personal obtenerPersonalPorId() {
//        return null;
//    }
//
//    //Mapper
//    private PersonalResponse mapDTO(Personal personal){
//        return new PersonalResponse(
//                personal.getRol().getNombre(),
//                personal.getEspecialidad(),
//                personal.getTipoIdentificacion(),
//                personal.getIdentificacion(),
//                personal.getPrimerNombre(),
//                personal.getSegundoNombre(),
//                personal.getPrimerApellido(),
//                personal.getSegundoApellido(),
//                personal.getDireccion(),
//                personal.getCarnet(),
//                personal.getUsuario(),
//                personal.isActivo(),
//                personal.getCreatedBy().getPrimerNombre() + personal.getCreatedBy().getPrimerApellido(),
//                personal.getCreatedAt().toString(),
//                personal.getUpdatedBy().getPrimerNombre() + personal.getUpdatedBy().getPrimerApellido(),
//                personal.getUpdatedAt().toString()
//        );
//    }
}
