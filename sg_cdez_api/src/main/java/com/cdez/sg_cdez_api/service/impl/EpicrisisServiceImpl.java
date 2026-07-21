package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.EpicrisisUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.EpicrisisResponse;
import com.cdez.sg_cdez_api.entity.AdultoMayor;
import com.cdez.sg_cdez_api.entity.Documento;
import com.cdez.sg_cdez_api.entity.Epicrisis;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.AdultoMayorRepository;
import com.cdez.sg_cdez_api.repository.DocumentoRepository;
import com.cdez.sg_cdez_api.repository.EpicrisisRepository;
import com.cdez.sg_cdez_api.repository.PersonalRepository;
import com.cdez.sg_cdez_api.service.EpicrisisService;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EpicrisisServiceImpl implements EpicrisisService {

    private final EpicrisisRepository epicrisisRepository;
    private final DocumentoRepository documentoRepository;
    private final AdultoMayorRepository adultoMayorRepository;
    private final PersonalRepository personalRepository;

    @Override
    @Transactional
    public EpicrisisResponse registrarEpicrisis(
            UUID adultoId,
            LocalDateTime fechaEmision,
            LocalDateTime fechaRecepcion,
            String centroSalud,
            MultipartFile archivo
    ) {
        AdultoMayor adultoMayor = adultoMayorRepository.findById(adultoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No se encontró el adulto mayor indicado."
                ));

        validarDatosRegistro(fechaEmision, centroSalud, archivo);

        Personal usuarioAutenticado = obtenerUsuarioAutenticado();
        LocalDateTime ahora = LocalDateTime.now();

        epicrisisRepository
                .findByDocumentoAdultoMayorAdultoIdAndVigenteTrueAndDocumentoActivoTrue(adultoId)
                .ifPresent(epicrisisAnterior -> {
                    epicrisisAnterior.setVigente(false);

                    Documento documentoAnterior = epicrisisAnterior.getDocumento();
                    documentoAnterior.setUpdatedBy(usuarioAutenticado);
                    documentoAnterior.setUpdatedAt(ahora);

                    documentoRepository.save(documentoAnterior);
                    epicrisisRepository.save(epicrisisAnterior);
                });

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

        Epicrisis epicrisis = new Epicrisis();
        epicrisis.setDocumento(documentoGuardado);
        epicrisis.setFechaEmision(fechaEmision);
        epicrisis.setFechaRecepcion(fechaRecepcion);
        epicrisis.setCentroSalud(centroSalud.trim());
        epicrisis.setVigente(true);

        Epicrisis epicrisisGuardada = epicrisisRepository.save(epicrisis);

        return mapToResponse(epicrisisGuardada);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EpicrisisResponse> listarEpicrisisPorAdulto(UUID adultoId) {
        if (!adultoMayorRepository.existsById(adultoId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No se encontró el adulto mayor indicado."
            );
        }

        return epicrisisRepository
                .findByDocumentoAdultoMayorAdultoIdOrderByFechaEmisionDesc(adultoId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EpicrisisResponse obtenerEpicrisisPorId(UUID epicrisisId) {
        Epicrisis epicrisis = buscarEpicrisis(epicrisisId);
        return mapToResponse(epicrisis);
    }

    @Override
    @Transactional(readOnly = true)
    public EpicrisisResponse obtenerEpicrisisVigente(UUID adultoId) {
        if (!adultoMayorRepository.existsById(adultoId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No se encontró el adulto mayor indicado."
            );
        }

        Epicrisis epicrisis = epicrisisRepository
                .findByDocumentoAdultoMayorAdultoIdAndVigenteTrueAndDocumentoActivoTrue(adultoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe una epicrisis vigente para este adulto mayor."
                ));

        return mapToResponse(epicrisis);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] descargarArchivo(UUID epicrisisId) {
        Epicrisis epicrisis = buscarEpicrisis(epicrisisId);
        Documento documento = epicrisis.getDocumento();

        if (!Boolean.TRUE.equals(documento.getActivo())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La epicrisis se encuentra inactiva."
            );
        }

        return documento.getArchivo();
    }

    @Override
    @Transactional(readOnly = true)
    public String obtenerNombreArchivo(UUID epicrisisId) {
        Epicrisis epicrisis = buscarEpicrisis(epicrisisId);
        return epicrisis.getDocumento().getNombreArchivo();
    }

    @Override
    @Transactional(readOnly = true)
    public String obtenerTipoArchivo(UUID epicrisisId) {
        Epicrisis epicrisis = buscarEpicrisis(epicrisisId);
        return epicrisis.getDocumento().getTipoArchivo();
    }

    @Override
    @Transactional
    public EpicrisisResponse actualizarMetadatos(UUID epicrisisId, EpicrisisUpdateRequest request) {
        Epicrisis epicrisis = buscarEpicrisis(epicrisisId);
        Documento documento = epicrisis.getDocumento();

        if (!Boolean.TRUE.equals(documento.getActivo())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede actualizar una epicrisis inactiva."
            );
        }

        if (request.fechaEmision() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de emisión es obligatoria."
            );
        }

        if (request.centroSalud() == null || request.centroSalud().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El centro de salud es obligatorio."
            );
        }

        Personal usuarioAutenticado = obtenerUsuarioAutenticado();

        epicrisis.setFechaEmision(request.fechaEmision());
        epicrisis.setFechaRecepcion(request.fechaRecepcion());
        epicrisis.setCentroSalud(request.centroSalud().trim());

        documento.setUpdatedBy(usuarioAutenticado);
        documento.setUpdatedAt(LocalDateTime.now());

        documentoRepository.save(documento);
        Epicrisis epicrisisActualizada = epicrisisRepository.save(epicrisis);

        return mapToResponse(epicrisisActualizada);
    }

    @Override
    @Transactional
    public void desactivarEpicrisis(UUID epicrisisId) {
        Epicrisis epicrisis = buscarEpicrisis(epicrisisId);
        Documento documento = epicrisis.getDocumento();

        if (!Boolean.TRUE.equals(documento.getActivo())) {
            return;
        }

        Personal usuarioAutenticado = obtenerUsuarioAutenticado();

        documento.setActivo(false);
        documento.setUpdatedBy(usuarioAutenticado);
        documento.setUpdatedAt(LocalDateTime.now());

        epicrisis.setVigente(false);

        documentoRepository.save(documento);
        epicrisisRepository.save(epicrisis);
    }

    private Epicrisis buscarEpicrisis(UUID epicrisisId) {
        return epicrisisRepository.findById(epicrisisId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No se encontró la epicrisis indicada."
                ));
    }

    private void validarDatosRegistro(
            LocalDateTime fechaEmision,
            String centroSalud,
            MultipartFile archivo
    ) {
        if (fechaEmision == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de emisión es obligatoria."
            );
        }

        if (centroSalud == null || centroSalud.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El centro de salud es obligatorio."
            );
        }

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

    private EpicrisisResponse mapToResponse(Epicrisis epicrisis) {
        Documento documento = epicrisis.getDocumento();
        AdultoMayor adultoMayor = documento.getAdultoMayor();

        return new EpicrisisResponse(
                epicrisis.getEpicrisisId(),
                documento.getDocumentoId(),
                adultoMayor != null ? adultoMayor.getAdultoId() : null,
                epicrisis.getFechaEmision(),
                epicrisis.getFechaRecepcion(),
                epicrisis.getCentroSalud(),
                documento.getNombreArchivo(),
                documento.getTipoArchivo(),
                documento.getTamanoArchivo(),
                epicrisis.getVigente(),
                documento.getActivo(),
                documento.getCreatedAt(),
                documento.getUpdatedAt()
        );
    }
}