package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.dto.response.ConsultaRecienteProjection;
import com.cdez.sg_cdez_api.dto.response.ConsultasPorEspecialidadProjection;
import com.cdez.sg_cdez_api.dto.response.ConsultasPorTipoProjection;
import com.cdez.sg_cdez_api.entity.Consulta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


public interface ConsultaRepository extends JpaRepository<Consulta, UUID>, JpaSpecificationExecutor<Consulta> {
    @Override
    @EntityGraph(attributePaths = {"consultaNutricional"})
    Page<Consulta> findAll(
            Specification<Consulta> spec,
            Pageable pageable
    );

    long countByActivoTrue();

    long countByActivoTrueAndCreatedAtGreaterThanEqual(
            LocalDateTime fechaInicio
    );

    long countByActivoTrueAndCreatedAtBetween(
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    );

    @Query("""
        SELECT
            p.especialidad AS especialidad,
            COUNT(c) AS cantidad
        FROM Consulta c
        JOIN c.createdBy p
        WHERE c.activo = true
          AND p.especialidad IS NOT NULL
        GROUP BY p.especialidad
        ORDER BY COUNT(c) DESC
    """)
    List<ConsultasPorEspecialidadProjection>
    contarConsultasActivasPorEspecialidad();

    long countByActivoTrueAndCreatedByPersonalId(UUID personalId);

    long countByActivoTrueAndCreatedByPersonalIdAndCreatedAtGreaterThanEqual(
            UUID personalId,
            LocalDateTime fechaInicio
    );

    long countByActivoTrueAndCreatedByPersonalIdAndCreatedAtBetween(
            UUID personalId,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    );

    @Query("""
        SELECT COUNT(DISTINCT c.adultoMayor.adultoId)
        FROM Consulta c
        WHERE c.activo = true
          AND c.createdBy.personalId = :personalId
    """)
    long contarAdultosAtendidos(
            @Param("personalId") UUID personalId
    );

    @Query("""
        SELECT
            COALESCE(c.tipoConsulta, 'Sin clasificar') AS tipoConsulta,
            COUNT(c) AS cantidad
        FROM Consulta c
        WHERE c.activo = true
        GROUP BY c.tipoConsulta
        ORDER BY COUNT(c) DESC
    """)
    List<ConsultasPorTipoProjection>
    contarConsultasActivasPorTipo();

    @Query("""
        SELECT
            COALESCE(c.tipoConsulta, 'Sin clasificar') AS tipoConsulta,
            COUNT(c) AS cantidad
        FROM Consulta c
        WHERE c.activo = true
          AND c.createdBy.personalId = :personalId
        GROUP BY c.tipoConsulta
        ORDER BY COUNT(c) DESC
    """)
    List<ConsultasPorTipoProjection> contarPorTipoConsulta(
            @Param("personalId") UUID personalId
    );

    @Query("""
        SELECT
            c.consultaId AS consultaId,
            a.adultoId AS adultoId,
            a.primerNombre AS primerNombre,
            a.segundoNombre AS segundoNombre,
            a.primerApellido AS primerApellido,
            a.segundoApellido AS segundoApellido,
            c.tipoConsulta AS tipoConsulta,
            c.motivo AS motivo,
            c.createdAt AS fecha
        FROM Consulta c
        JOIN c.adultoMayor a
        WHERE c.activo = true
        ORDER BY c.createdAt DESC
    """)
    List<ConsultaRecienteProjection>
    buscarConsultasRecientes(Pageable pageable);


    @Query("""
        SELECT
            c.consultaId AS consultaId,
            a.adultoId AS adultoId,
            a.primerNombre AS primerNombre,
            a.segundoNombre AS segundoNombre,
            a.primerApellido AS primerApellido,
            a.segundoApellido AS segundoApellido,
            c.tipoConsulta AS tipoConsulta,
            c.motivo AS motivo,
            c.createdAt AS fecha
        FROM Consulta c
        JOIN c.adultoMayor a
        WHERE c.activo = true
          AND c.createdBy.personalId = :personalId
        ORDER BY c.createdAt DESC
    """)
    List<ConsultaRecienteProjection> buscarConsultasRecientes(
            @Param("personalId") UUID personalId,
            Pageable pageable
    );
}
