package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.ConsultaNutricional;
import com.cdez.sg_cdez_api.entity.ConsultaPsych;
import com.cdez.sg_cdez_api.entity.Tamizaje;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TamizajeRepository extends JpaRepository<Tamizaje, UUID> {
    List<Tamizaje> findByConsultaNutricional(ConsultaNutricional consultaNutricional);
    List<Tamizaje> findByConsultaPsych(ConsultaPsych consultaPsych);
    Optional<Tamizaje> findByTamizajeIdAndConsultaNutricionalConsultaNutricionalId(UUID tamizajeId, UUID consultaId);
    Optional<Tamizaje> findByTamizajeIdAndConsultaPsychConsultaPsychId(UUID tamizajeId, UUID consultaId);
}
