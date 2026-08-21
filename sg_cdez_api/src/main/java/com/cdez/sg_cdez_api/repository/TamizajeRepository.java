package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.ConsultaNutricional;
import com.cdez.sg_cdez_api.entity.TamizajeNutricional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TamizajeRepository extends JpaRepository<TamizajeNutricional, UUID> {
    List<TamizajeNutricional> findByConsultaNutricional(ConsultaNutricional consultaNutricional);
    Optional<TamizajeNutricional> findByTamizajeIdAndConsultaNutricionalConsultaNutricionalId(UUID tamizajeId, UUID consultaId);
}
