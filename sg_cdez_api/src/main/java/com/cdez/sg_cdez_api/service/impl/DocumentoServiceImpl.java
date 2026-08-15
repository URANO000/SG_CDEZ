package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.response.DocumentoResponse;
import com.cdez.sg_cdez_api.entity.AdultoMayor;
import com.cdez.sg_cdez_api.entity.Documento;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.AdultoMayorRepository;
import com.cdez.sg_cdez_api.repository.DocumentoRepository;
import com.cdez.sg_cdez_api.repository.EpicrisisRepository;
import com.cdez.sg_cdez_api.repository.PersonalRepository;
import com.cdez.sg_cdez_api.service.DocumentoService;
import com.cdez.sg_cdez_api.service.AuditoriaService;
import com.cdez.sg_cdez_api.util.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Paths;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentoServiceImpl implements DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final AdultoMayorRepository adultoMayorRepository;
    private final PersonalRepository personalRepository;
    private final EpicrisisRepository epicrisisRepository;
    private final AuditoriaService auditoriaService;
    private final AuthHelper AUTH_HELPER;

    @Override
    @Transactional
    public DocumentoResponse registrarDocumentoExpediente(UUID adultoId, MultipartFile archivo) {
        AdultoMayor adultoMayor = adultoMayorRepository.findById(adultoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No se encontró el adulto mayor indicado."
                ));

        validarArchivo(archivo);

        Personal usuarioAutenticado = AUTH_HELPER.obtenerUsuarioAutenticado();
        LocalDateTime ahora = LocalDateTime.now();

        Documento documento = new Documento();
        documento.setAdultoMayor(adultoMayor);
        documento.setPersonal(null);
        documento.setEncargadoLegal(null);

        documento.setNombreArchivo(obtenerNombreSeguro(archivo));
        documento.setTipoArchivo(obtenerTipoArchivoSeguro(archivo));
        documento.setTamanoArchivo(archivo.getSize());

        documento.setActivo(true);
        documento.setCreatedBy(usuarioAutenticado);
        documento.setCreatedAt(ahora);

        try {
            documento.setArchivo(archivo.getBytes());
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No fue posible leer el archivo adjunto."
            );
        }

        Documento documentoGuardado = documentoRepository.save(documento);

        //Auditar cuando se sube un documento
        auditoriaService.registrarAccion(
                "SUBIR_DOCUMENTO",
                "DOCUMENTO",
                "Documento",
                documentoGuardado.getDocumentoId().toString(),
                "Se subió un documento al expediente del adulto mayor."
        );

        return mapToResponse(documentoGuardado);
    }

    @Override
    @Transactional
    public void registrarDocumentoPersonal(List<MultipartFile> archivos, Personal personal) throws IOException {
        if (archivos == null || archivos.isEmpty()) {
            return;
        }
        Personal usuarioActual = AUTH_HELPER.obtenerUsuarioAutenticado();
        for (MultipartFile archivo : archivos){
            validarArchivo(archivo);

            Documento documento = new Documento();

            documento.setPersonal(personal);
            documento.setNombreArchivo(archivo.getOriginalFilename());
            documento.setTipoArchivo(archivo.getContentType());
            documento.setTamanoArchivo(archivo.getSize());
            documento.setArchivo(archivo.getBytes());
            documento.setActivo(true);

            documento.setCreatedBy(usuarioActual);
            documento.setCreatedAt(LocalDateTime.now(Clock.systemUTC()));

            documentoRepository.save(documento);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentoResponse> listarDocumentosPorAdulto(UUID adultoId) {
        if (!adultoMayorRepository.existsById(adultoId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No se encontró el adulto mayor indicado."
            );
        }

        return documentoRepository
                .findByAdultoMayorAdultoIdAndActivoTrueOrderByCreatedAtDesc(adultoId)
                .stream()
                .filter(documento -> !epicrisisRepository.existsByDocumentoDocumentoId(documento.getDocumentoId()))
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<DocumentoResponse> listarDocumentosPorPersonal(Personal personal) {
        return documentoRepository.findByPersonalPersonalIdAndActivoTrueOrderByCreatedAtDesc(personal.getPersonalId())
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentoResponse obtenerDocumentoPorId(Integer documentoId) {
        Documento documento = buscarDocumentoExpediente(documentoId);
        return mapToResponse(documento);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] descargarArchivo(Integer documentoId) {
        Documento documento = buscarDocumentoExpediente(documentoId);

        if (!Boolean.TRUE.equals(documento.getActivo())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El documento se encuentra inactivo."
            );
        }

        //Auditar cuando se descarga un documento
        auditoriaService.registrarAccion(
                "DESCARGAR_DOCUMENTO",
                "DOCUMENTO",
                "Documento",
                documento.getDocumentoId().toString(),
                "Se descargó un documento del expediente del adulto mayor."
        );
        return documento.getArchivo();
    }

    @Override
    @Transactional(readOnly = true)
    public String obtenerNombreArchivo(Integer documentoId) {
        Documento documento = buscarDocumentoExpediente(documentoId);
        return documento.getNombreArchivo();
    }

    @Override
    @Transactional(readOnly = true)
    public String obtenerTipoArchivo(Integer documentoId) {
        Documento documento = buscarDocumentoExpediente(documentoId);
        return documento.getTipoArchivo();
    }

    @Override
    @Transactional
    public void desactivarDocumento(Integer documentoId) {
        Documento documento = buscarDocumentoExpediente(documentoId);

        if (!Boolean.TRUE.equals(documento.getActivo())) {
            return;
        }

        Personal usuarioAutenticado = obtenerUsuarioAutenticado();

        documento.setActivo(false);
        documento.setUpdatedBy(usuarioAutenticado);
        documento.setUpdatedAt(LocalDateTime.now());

        documentoRepository.save(documento);

        //Auditar cuando se desactiva un documento
        auditoriaService.registrarAccion(
                "DESACTIVAR_DOCUMENTO",
                "DOCUMENTO",
                "Documento",
                documento.getDocumentoId().toString(),
                "Se desactivó un documento del expediente del adulto mayor."
        );
    }

    @Override
    public void desactivarDocumentosPersonal(List<Integer> requests, Personal personal) {
        for(var request:requests){
            Documento documentoADesactivar = documentoRepository.findByDocumentoIdAndPersonalPersonalId(request, personal.getPersonalId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "El documento indicado no fue encontrado"
                    ));

            documentoADesactivar.setActivo(false);
            documentoRepository.save(documentoADesactivar);
        }
    }

    private Documento buscarDocumentoExpediente(Integer documentoId) {
        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No se encontró el documento indicado."
                ));

        if (epicrisisRepository.existsByDocumentoDocumentoId(documento.getDocumentoId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este documento pertenece al módulo de epicrisis."
            );
        }

        return documento;
    }

    private void validarArchivo(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty() || archivo.getSize() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debe adjuntar un archivo válido."
            );
        }
    }

    private Personal obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "No se encontró un usuario autenticado."
            );
        }

        String usuario = authentication.getName();

        return personalRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "El usuario autenticado no está registrado como personal."
                ));
    }

    private String obtenerNombreSeguro(MultipartFile archivo) {
        String nombreOriginal = archivo.getOriginalFilename();

        if (nombreOriginal == null || nombreOriginal.isBlank()) {
            return "documento";
        }

        return Paths.get(nombreOriginal).getFileName().toString();
    }

    private String obtenerTipoArchivoSeguro(MultipartFile archivo) {
        String tipoArchivo = archivo.getContentType();

        if (tipoArchivo == null || tipoArchivo.isBlank()) {
            return "application/octet-stream";
        }

        return tipoArchivo;
    }

    private DocumentoResponse mapToResponse(Documento documento) {
        AdultoMayor adultoMayor = documento.getAdultoMayor();

        return new DocumentoResponse(
                documento.getDocumentoId(),
                adultoMayor != null ? adultoMayor.getAdultoId() : null,
                documento.getNombreArchivo(),
                documento.getTipoArchivo(),
                documento.getTamanoArchivo(),
                documento.getActivo() ? "Activo" : "Inactivo",
                documento.getCreatedAt(),
                documento.getUpdatedAt()
        );
    }
}