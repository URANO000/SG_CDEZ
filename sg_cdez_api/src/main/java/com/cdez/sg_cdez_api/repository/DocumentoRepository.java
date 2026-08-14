package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.dto.response.DocumentoResponse;
import com.cdez.sg_cdez_api.entity.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DocumentoRepository extends JpaRepository<Documento, Integer> {

    List<Documento> findByAdultoMayorAdultoIdAndActivoTrueOrderByCreatedAtDesc(UUID adultoId);

    List<Documento> findByPersonalPersonalIdOrderByCreatedAtDesc(UUID personalId);
    Optional<Documento> findByDocumentoIdAndPersonalPersonalId(Integer documentoId, UUID personalId);
}