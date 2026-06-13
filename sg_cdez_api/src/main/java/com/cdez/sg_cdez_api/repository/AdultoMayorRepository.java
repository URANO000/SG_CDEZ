package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.AdultoMayor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AdultoMayorRepository extends JpaRepository<AdultoMayor, UUID> {
    List<AdultoMayor> findByActivoTrue();

    List<AdultoMayor> findByActivoFalseAndFechaFallecimientoIsNull();

    List<AdultoMayor> findByFechaFallecimientoIsNotNull();
}