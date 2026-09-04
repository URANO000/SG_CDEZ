package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.ConsultaNutricional;
import com.cdez.sg_cdez_api.entity.ConsultaPsych;
import com.cdez.sg_cdez_api.entity.Tamizaje;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TamizajeRepository extends JpaRepository<Tamizaje, UUID> {
    List<Tamizaje> findByConsultaConsultaNutricional(ConsultaNutricional consultaNutricional);
    List<Tamizaje> findByConsultaConsultaPsych(ConsultaPsych consultaPsych);
    Optional<Tamizaje> findByTamizajeIdAndConsultaConsultaNutricionalConsultaNutricionalId(UUID tamizajeId, UUID consultaId);
    Optional<Tamizaje> findByTamizajeIdAndConsultaConsultaPsychConsultaPsychId(UUID tamizajeId, UUID consultaId);
}
