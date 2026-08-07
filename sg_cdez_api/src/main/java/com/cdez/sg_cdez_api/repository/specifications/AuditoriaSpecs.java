package com.cdez.sg_cdez_api.repository.specifications;

import com.cdez.sg_cdez_api.dto.request.AuditoriaFiltroRequest;
import com.cdez.sg_cdez_api.entity.Auditoria;
import com.cdez.sg_cdez_api.entity.Personal;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.UUID;

public class AuditoriaSpecs {

    private AuditoriaSpecs() {
    }

    public static Specification<Auditoria> conFiltros(AuditoriaFiltroRequest filtro) {
        return Specification
                .where(usuarioIdEs(filtro.usuarioId()))
                .and(usuarioContiene(filtro.usuario()))
                .and(accionEs(filtro.accion()))
                .and(moduloEs(filtro.modulo()))
                .and(fechaDesde(filtro.fechaDesde()))
                .and(fechaHasta(filtro.fechaHasta()));
    }

    private static Specification<Auditoria> usuarioIdEs(UUID usuarioId) {
        return (root, query, criteriaBuilder) -> {
            if (usuarioId == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("usuario").get("personalId"),
                    usuarioId
            );
        };
    }

    private static Specification<Auditoria> usuarioContiene(String usuario) {
        return (root, query, criteriaBuilder) -> {
            if (usuario == null || usuario.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            Join<Auditoria, Personal> usuarioJoin = root.join("usuario");

            return criteriaBuilder.like(
                    criteriaBuilder.lower(usuarioJoin.get("usuario")),
                    "%" + usuario.toLowerCase().trim() + "%"
            );
        };
    }

    private static Specification<Auditoria> accionEs(String accion) {
        return (root, query, criteriaBuilder) -> {
            if (accion == null || accion.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    criteriaBuilder.upper(root.get("accion")),
                    accion.trim().toUpperCase()
            );
        };
    }

    private static Specification<Auditoria> moduloEs(String modulo) {
        return (root, query, criteriaBuilder) -> {
            if (modulo == null || modulo.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    criteriaBuilder.upper(root.get("modulo")),
                    modulo.trim().toUpperCase()
            );
        };
    }

    private static Specification<Auditoria> fechaDesde(LocalDateTime fechaDesde) {
        return (root, query, criteriaBuilder) -> {
            if (fechaDesde == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.greaterThanOrEqualTo(
                    root.get("createdAt"),
                    fechaDesde
            );
        };
    }

    private static Specification<Auditoria> fechaHasta(LocalDateTime fechaHasta) {
        return (root, query, criteriaBuilder) -> {
            if (fechaHasta == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.lessThanOrEqualTo(
                    root.get("createdAt"),
                    fechaHasta
            );
        };
    }
}