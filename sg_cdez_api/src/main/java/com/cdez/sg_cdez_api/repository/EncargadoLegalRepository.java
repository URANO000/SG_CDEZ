package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.EncargadoLegal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EncargadoLegalRepository
        extends JpaRepository<EncargadoLegal, UUID> {

    List<EncargadoLegal>
    findByAdultosAdultoIdAndActivoTrue(UUID adultoId);

    long countByAdultosAdultoIdAndActivoTrue(UUID adultoId);
}