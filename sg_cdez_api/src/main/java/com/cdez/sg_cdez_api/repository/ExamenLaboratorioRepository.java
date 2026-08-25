package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.ConsultaNutricional;
import com.cdez.sg_cdez_api.entity.ExamenLaboratorio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExamenLaboratorioRepository extends JpaRepository<ExamenLaboratorio, UUID> {
    List<ExamenLaboratorio> findByConsultaNutricional(ConsultaNutricional consultaNutricional);
    Optional<ExamenLaboratorio> findByExamenIdAndConsultaNutricionalConsultaNutricionalId(UUID examenId, UUID consultaId);
}
