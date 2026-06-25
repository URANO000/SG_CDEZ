package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.PersonalActualizarRequest;
import com.cdez.sg_cdez_api.dto.request.PersonalCreateRequest;
import com.cdez.sg_cdez_api.dto.response.PersonalResponse;
import com.cdez.sg_cdez_api.service.PersonalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/personal")
@RequiredArgsConstructor
public class PersonalController {
    private final PersonalService SERVICE;

    @GetMapping("/listarPersonal")
    public List<PersonalResponse> listarPersonal(){
        return SERVICE.listarPersonal();
    }

    @GetMapping("/obtenerPersonalPorId/{id}")
    public PersonalResponse obtenerPersonalPorId(@PathVariable(name = "id") UUID id){
        return SERVICE.obtenerPersonalPorId(id);
    }

    @PostMapping("/crearPersonal")
    public PersonalResponse crearPersonal(@RequestBody PersonalCreateRequest request){
        return SERVICE.crearPersonal(request);
    }

    @PostMapping("/actualizarPersonal/{id}")
    public PersonalResponse actualizarPersonal(@PathVariable(name = "id") UUID id,@RequestBody PersonalActualizarRequest request){
        return SERVICE.actualizarPersonal(id,request);
    }

    @PostMapping("/activarPersonal/{id}")
    public PersonalResponse activarPersonal(@PathVariable(name = "id") UUID id){
        return SERVICE.activarPersonal(id);
    }

    @PostMapping("/desactivarPersonal/{id}")
    public PersonalResponse desactivarPersonal(@PathVariable(name = "id") UUID id){
        return SERVICE.desactivarPersonal(id);
    }
}
