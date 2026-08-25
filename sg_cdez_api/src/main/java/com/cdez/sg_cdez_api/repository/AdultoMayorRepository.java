package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.AdultoMayor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface AdultoMayorRepository
        extends JpaRepository<AdultoMayor, UUID>,
        JpaSpecificationExecutor<AdultoMayor> {

    boolean existsByIdentificacion(
            String identificacion
    );

    long countByActivoTrue();
}