package com.cdez.sg_cdez_api.repository.specifications;

import com.cdez.sg_cdez_api.entity.Consulta;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class ConsultaSpecs {
    public static Specification<Consulta> hasAdultoId(UUID providedAdultoId){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("adultoMayor").get("adultoId"), providedAdultoId);
    }

    public static Specification<Consulta> hasCreatedById(UUID providedPersonalId){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("createdBy").get("personalId"), providedPersonalId);
    }

    public static Specification<Consulta> hasEspecialidad(String providedEspecialidad){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("createdBy").get("especialidad"), providedEspecialidad);
    }

    public static Specification<Consulta> hasDate(LocalDate providedDate){
        return (root, query, criteriaBuilder) -> {
            LocalDateTime startOfDay = providedDate.atStartOfDay();
            LocalDateTime endOfDay = providedDate.plusDays(1).atStartOfDay();

            return criteriaBuilder.and(
                    criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startOfDay),
                    criteriaBuilder.lessThan(root.get("createdAt"), endOfDay)
            );
        };
    }

    public static Specification<Consulta> hasDateRange(LocalDate providedStartDate,LocalDate providedEndDate){
        return (root, query, criteriaBuilder) -> {
            LocalDateTime startDate= providedStartDate.atStartOfDay();
            LocalDateTime endDate = providedEndDate.plusDays(1).atStartOfDay();

            return criteriaBuilder.and(
                    criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startDate),
                    criteriaBuilder.lessThan(root.get("createdAt"), endDate)
            );
        };
    }

    public static Specification<Consulta> isActivo(boolean providedEstado){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activo"), providedEstado);
    }

    public static Specification<Consulta> containsName(String providedSearch){
        return (root, query, criteriaBuilder) -> {
            String pattern = "%" + providedSearch.toLowerCase().trim() + "%";

            Expression<String> fullName =
                    criteriaBuilder.concat(
                            criteriaBuilder.concat(
                                    criteriaBuilder.concat(
                                            criteriaBuilder.coalesce(root.get("createdBy").get("primerNombre"), ""),
                                            " "
                                    ),
                                    criteriaBuilder.concat(
                                            criteriaBuilder.coalesce(root.get("createdBy").get("segundoNombre"), ""),
                                            " "
                                    )
                            ),
                            criteriaBuilder.concat(
                                    criteriaBuilder.concat(
                                            criteriaBuilder.coalesce(root.get("createdBy").get("primerApellido"), ""),
                                            criteriaBuilder.literal(" ")
                                    ),
                                    criteriaBuilder.coalesce(root.get("createdBy").get("segundoApellido"), "")
                            )
                    );
            // Case-insensitive
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("createdBy").get("primerNombre")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("createdBy").get("segundoNombre")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("createdBy").get("primerApellido")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("createdBy").get("segundoApellido")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(fullName), pattern)
            );

        };
    }
}
