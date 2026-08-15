package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.PersonalActualizarRequest;
import com.cdez.sg_cdez_api.dto.request.PersonalCreateRequest;
import com.cdez.sg_cdez_api.dto.request.PersonalFiltro;
import com.cdez.sg_cdez_api.dto.response.PageResponse;
import com.cdez.sg_cdez_api.dto.response.PersonalResponse;
import com.cdez.sg_cdez_api.service.PersonalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

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

    @GetMapping("/reporte")
    public ResponseEntity<byte[]> generarReportePdf() throws IOException {
        byte[] pdf = SERVICE.generarReportePersonalPDF();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=reporte_de_personal.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
