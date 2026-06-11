package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.response.PersonalResponse;
import com.cdez.sg_cdez_api.service.PersonalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/personal")
@RequiredArgsConstructor
public class PersonalController {
    private final PersonalService SERVICE;

//    @GetMapping("/listarPersonal")
//    public List<PersonalResponse> listarPersonal(){
//        return SERVICE.listarPersonal();
//    }
}
