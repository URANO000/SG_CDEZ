package com.cdez.sg_cdez_api.repository.specifications;

import com.cdez.sg_cdez_api.entity.Consulta;
import com.cdez.sg_cdez_api.entity.HistorialAcciones;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class HistorialAccionesSpecs {
    public static Specification<HistorialAcciones> hasDate(LocalDate providedDate){
        return (root, query, criteriaBuilder) -> {
            LocalDateTime startOfDay = providedDate.atStartOfDay();
            LocalDateTime endOfDay = providedDate.plusDays(1).atStartOfDay();

            return criteriaBuilder.and(
                    criteriaBuilder.greaterThanOrEqualTo(root.get("performedAt"), startOfDay),
                    criteriaBuilder.lessThan(root.get("performedAt"), endOfDay)
            );
        };
    }

    public static Specification<Consulta> hasDateRange(LocalDate providedStartDate, LocalDate providedEndDate){
        return (root, query, criteriaBuilder) -> {
            LocalDateTime startDate= providedStartDate.atStartOfDay();
            LocalDateTime endDate = providedEndDate.plusDays(1).atStartOfDay();

            return criteriaBuilder.and(
                    criteriaBuilder.greaterThanOrEqualTo(root.get("performedAt"), startDate),
                    criteriaBuilder.lessThan(root.get("performedAt"), endDate)
            );
        };
    }

    public static Specification<HistorialAcciones> containsSearch(String providedSearch){
        return (root, query, criteriaBuilder) -> {
            String pattern = "%" + providedSearch.toLowerCase().trim() + "%";

            Expression<String> fullName =
                    criteriaBuilder.concat(
                            criteriaBuilder.concat(
                                    criteriaBuilder.concat(
                                            criteriaBuilder.coalesce(root.get("performedBy").get("primerNombre"), ""),
                                            " "
                                    ),
                                    criteriaBuilder.concat(
                                            criteriaBuilder.coalesce(root.get("performedBy").get("segundoNombre"), ""),
                                            " "
                                    )
                            ),
                            criteriaBuilder.concat(
                                    criteriaBuilder.concat(
                                            criteriaBuilder.coalesce(root.get("performedBy").get("primerApellido"), ""),
                                            criteriaBuilder.literal(" ")
                                    ),
                                    criteriaBuilder.coalesce(root.get("performedAt").get("segundoApellido"), "")
                            )
                    );
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("performedBy").get("primerNombre")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("performedBy").get("segundoNombre")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("performedBy").get("primerApellido")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("performedBy").get("segundoApellido")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(fullName), pattern)
            );


        };
    }
}
