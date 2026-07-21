package com.cdez.sg_cdez_api.repository.specifications;

import com.cdez.sg_cdez_api.entity.Personal;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;


public class PersonalSpecs {

    public static Specification<Personal> hasEspecialidad(String providedEspecialidad){
        // Lambda
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("especialidad"), providedEspecialidad);
    }

    public static Specification<Personal> hasEstado(boolean providedEstado){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activo"), providedEstado);
    }

    public static Specification<Personal> containsSearch(String providedSearch){
        // Lambda
        return (root, query, criteriaBuilder) -> {
            String pattern = "%" + providedSearch.toLowerCase().trim() + "%";

            Expression<String> fullName =
                    criteriaBuilder.concat(
                            criteriaBuilder.concat(
                                    criteriaBuilder.concat(
                                            criteriaBuilder.coalesce(root.get("primerNombre"), ""),
                                            " "
                                    ),
                                    criteriaBuilder.concat(
                                            criteriaBuilder.coalesce(root.get("segundoNombre"), ""),
                                            " "
                                    )
                            ),
                            criteriaBuilder.concat(
                                    criteriaBuilder.concat(
                                            criteriaBuilder.coalesce(root.get("primerApellido"), ""),
                                            criteriaBuilder.literal(" ")
                                    ),
                                    criteriaBuilder.coalesce(root.get("segundoApellido"), "")
                            )
                    );

            // Case-insensitive
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("primerNombre")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("segundoNombre")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("primerApellido")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("segundoApellido")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(fullName), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("identificacion")), pattern)
            );
        };
    }
}
