package com.cdez.sg_cdez_api.repository.specifications;

import com.cdez.sg_cdez_api.entity.AdultoMayor;

import jakarta.persistence.criteria.Expression;

import org.springframework.data.jpa.domain.Specification;

import java.util.Locale;

public class AdultoMayorSpecs {

    private AdultoMayorSpecs() {
    }

    public static Specification<AdultoMayor> hasEstado(
            String estado
    ) {
        return (
                root,
                query,
                criteriaBuilder
        ) -> {
            String estadoNormalizado = estado
                    .trim()
                    .toUpperCase(Locale.ROOT);

            return switch (estadoNormalizado) {

                case "ACTIVO" ->
                        criteriaBuilder.isTrue(
                                root.get("activo")
                        );

                case "INACTIVO" ->
                        criteriaBuilder.and(
                                criteriaBuilder.isFalse(
                                        root.get("activo")
                                ),
                                criteriaBuilder.isNull(
                                        root.get(
                                                "fechaFallecimiento"
                                        )
                                )
                        );

                case "FALLECIDO" ->
                        criteriaBuilder.isNotNull(
                                root.get(
                                        "fechaFallecimiento"
                                )
                        );

                default ->
                        criteriaBuilder.conjunction();
            };
        };
    }

    public static Specification<AdultoMayor> containsSearch(
            String searchTerm
    ) {
        return (
                root,
                query,
                criteriaBuilder
        ) -> {
            String pattern =
                    "%" +
                            searchTerm
                                    .toLowerCase(Locale.ROOT)
                                    .trim() +
                            "%";

            Expression<String> nombreCompleto =
                    criteriaBuilder.concat(
                            criteriaBuilder.concat(
                                    criteriaBuilder.concat(
                                            criteriaBuilder.coalesce(
                                                    root.get(
                                                            "primerNombre"
                                                    ),
                                                    ""
                                            ),
                                            " "
                                    ),
                                    criteriaBuilder.concat(
                                            criteriaBuilder.coalesce(
                                                    root.get(
                                                            "segundoNombre"
                                                    ),
                                                    ""
                                            ),
                                            " "
                                    )
                            ),
                            criteriaBuilder.concat(
                                    criteriaBuilder.concat(
                                            criteriaBuilder.coalesce(
                                                    root.get(
                                                            "primerApellido"
                                                    ),
                                                    ""
                                            ),
                                            " "
                                    ),
                                    criteriaBuilder.coalesce(
                                            root.get(
                                                    "segundoApellido"
                                            ),
                                            ""
                                    )
                            )
                    );

            return criteriaBuilder.or(
                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get(
                                            "primerNombre"
                                    )
                            ),
                            pattern
                    ),
                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get(
                                            "segundoNombre"
                                    )
                            ),
                            pattern
                    ),
                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get(
                                            "primerApellido"
                                    )
                            ),
                            pattern
                    ),
                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get(
                                            "segundoApellido"
                                    )
                            ),
                            pattern
                    ),
                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    nombreCompleto
                            ),
                            pattern
                    ),
                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get(
                                            "identificacion"
                                    )
                            ),
                            pattern
                    )
            );
        };
    }
}