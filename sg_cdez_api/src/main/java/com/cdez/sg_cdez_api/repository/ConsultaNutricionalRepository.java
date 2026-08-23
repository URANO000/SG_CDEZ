package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.ConsultaNutricional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface ConsultaNutricionalRepository extends JpaRepository<ConsultaNutricional, UUID>, JpaSpecificationExecutor<ConsultaNutricional> {
    List<ConsultaNutricional> findByConsultaActivoTrue();
    List<ConsultaNutricional> findAllByConsultaConsultaIdIn(Collection<UUID> consultaIds);
}
