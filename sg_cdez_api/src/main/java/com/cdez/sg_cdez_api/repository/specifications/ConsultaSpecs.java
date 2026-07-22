package com.cdez.sg_cdez_api.repository.specifications;

import com.cdez.sg_cdez_api.entity.Consulta;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class ConsultaSpecs {
    public static Specification<Consulta> hasAdultoId(UUID providedAdultoId){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("adultoMayor").get("adultoId"), providedAdultoId);
    }
}
