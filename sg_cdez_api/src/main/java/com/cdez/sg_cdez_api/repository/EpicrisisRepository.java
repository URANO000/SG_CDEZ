package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.Epicrisis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDateTime;

public interface EpicrisisRepository extends JpaRepository<Epicrisis, UUID> {

    List<Epicrisis> findByDocumentoAdultoMayorAdultoIdOrderByFechaEmisionDesc(UUID adultoId);

    List<Epicrisis> findByDocumentoAdultoMayorAdultoIdAndDocumentoActivoTrueOrderByFechaEmisionDesc(UUID adultoId);

    Optional<Epicrisis> findByDocumentoAdultoMayorAdultoIdAndVigenteTrueAndDocumentoActivoTrue(UUID adultoId);

    boolean existsByDocumentoDocumentoId(Integer documentoId);

    List<Epicrisis>
    findByDocumentoAdultoMayorAdultoIdAndFechaEmisionGreaterThanEqualAndFechaEmisionLessThanOrderByFechaEmisionDesc(
            UUID adultoId,
            LocalDateTime inicio,
            LocalDateTime fin
    );
}