package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface ConsultaRepository extends JpaRepository<Consulta, Integer>, JpaSpecificationExecutor<Consulta> {
}
