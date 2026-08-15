package com.cdez.sg_cdez_api.repository.specifications;

import com.cdez.sg_cdez_api.entity.Epicrisis;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.UUID;

public final class EpicrisisSpecs {

    private EpicrisisSpecs() {
    }

    public static Specification<Epicrisis> perteneceAlAdulto(UUID adultoId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(
                        root.get("documento")
                                .get("adultoMayor")
                                .get("adultoId"),
                        adultoId
                );
    }

    public static Specification<Epicrisis> esHistorial() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isFalse(root.get("vigente"));
    }

    public static Specification<Epicrisis> documentoActivo() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isTrue(
                        root.get("documento").get("activo")
                );
    }

    public static Specification<Epicrisis> emitidaEnAnio(Integer anio) {
        if (anio == null) {
            return Specification.unrestricted();
        }

        LocalDateTime inicio = LocalDateTime.of(anio, 1, 1, 0, 0);
        LocalDateTime fin = inicio.plusYears(1);

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.and(
                        criteriaBuilder.greaterThanOrEqualTo(
                                root.get("fechaEmision"),
                                inicio
                        ),
                        criteriaBuilder.lessThan(
                                root.get("fechaEmision"),
                                fin
                        )
                );
    }
}