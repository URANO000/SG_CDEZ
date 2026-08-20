package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.*;
import com.cdez.sg_cdez_api.service.PersonalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
@RestController
@RequestMapping("api/personal")
@RequiredArgsConstructor
public class PersonalController {
    private final PersonalService SERVICE;

    @PostMapping("/listarPersonalFiltrado")
    public PageResponse<PersonalResponse> listarPersonalFiltrado(@RequestBody PersonalFiltro filtros,@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable){
        return SERVICE.listarPersonalFiltrado(filtros, pageable);
    }

    @GetMapping("/obtenerPersonalPorId/{id}")
    public PersonalResponse obtenerPersonalPorId(@PathVariable(name = "id") UUID id){
        return SERVICE.obtenerPersonalPorId(id);
    }

    @PostMapping(value = "/crearPersonal", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PersonalResponse crearPersonal(
            @RequestPart("personal") PersonalCreateRequest request,
            @RequestPart(value = "documentos", required = false) List<MultipartFile> documentos
    ) throws IOException {

        return SERVICE.crearPersonal(request, documentos);
    }

    @PostMapping(value= "/actualizarPersonal/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PersonalResponse actualizarPersonal(
            @PathVariable(name = "id") UUID id,
            @RequestPart("personal") PersonalActualizarRequest request,
            @RequestPart(value = "documentosCrear", required = false) List<MultipartFile> documentosCrear) throws IOException {
        return SERVICE.actualizarPersonal(id,request, documentosCrear);
    }

    @PostMapping("/activarPersonal/{id}")
    public PersonalResponse activarPersonal(@PathVariable(name = "id") UUID id){
        return SERVICE.activarPersonal(id);
    }

    @PostMapping("/desactivarPersonal/{id}")
    public PersonalResponse desactivarPersonal(@PathVariable(name = "id") UUID id){
        return SERVICE.desactivarPersonal(id);
    }

    @GetMapping("/reportePDF")
    public ResponseEntity<byte[]> generarReportePdf() throws IOException {
        byte[] pdf = SERVICE.generarReportePersonalPDF();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=reporte_de_personal.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
