package com.cdez.sg_cdez_api.repository.specifications;

import com.cdez.sg_cdez_api.dto.request.AuditoriaFiltroRequest;
import com.cdez.sg_cdez_api.entity.Auditoria;
import com.cdez.sg_cdez_api.entity.Personal;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.UUID;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class AuditoriaSpecs {

    private AuditoriaSpecs() {
    }

    public static Specification<Auditoria> conFiltros(AuditoriaFiltroRequest filtro) {
        return Specification
                .where(usuarioIdEs(filtro.usuarioId()))
                .and(usuarioContiene(filtro.usuario()))
                .and(accionEs(filtro.accion()))
                .and(modulosEn(filtro.modulos()))
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

    private static Specification<Auditoria> usuarioContiene(
            String usuario
    ) {
        return (root, query, criteriaBuilder) -> {
            if (usuario == null || usuario.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            Join<Auditoria, Personal> usuarioJoin =
                    root.join("usuario");

            String[] terminos =
                    usuario.trim()
                            .toLowerCase(Locale.ROOT)
                            .split("\\s+");

            List<Predicate> condiciones =
                    new ArrayList<>();

            for (String termino : terminos) {
                String patron = "%" + termino + "%";

                Predicate coincideTermino =
                        criteriaBuilder.or(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(
                                                usuarioJoin.get("usuario")
                                        ),
                                        patron
                                ),
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(
                                                usuarioJoin.get("primerNombre")
                                        ),
                                        patron
                                ),
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(
                                                usuarioJoin.get("segundoNombre")
                                        ),
                                        patron
                                ),
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(
                                                usuarioJoin.get("primerApellido")
                                        ),
                                        patron
                                ),
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(
                                                usuarioJoin.get("segundoApellido")
                                        ),
                                        patron
                                )
                        );

                condiciones.add(coincideTermino);
            }

            return criteriaBuilder.and(
                    condiciones.toArray(
                            new Predicate[0]
                    )
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

    private static Specification<Auditoria> modulosEn(
            List<String> modulos
    ) {
        return (root, query, criteriaBuilder) -> {
            if (modulos == null || modulos.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            List<String> modulosNormalizados =
                    modulos.stream()
                            .filter(modulo ->
                                    modulo != null &&
                                            !modulo.isBlank()
                            )
                            .map(modulo ->
                                    modulo.trim().toUpperCase()
                            )
                            .distinct()
                            .toList();

            if (modulosNormalizados.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder
                    .upper(root.get("modulo"))
                    .in(modulosNormalizados);
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