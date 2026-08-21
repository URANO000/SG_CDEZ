package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.Antropometria;
import com.cdez.sg_cdez_api.entity.ConsultaNutricional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AntropometriaRepository extends JpaRepository<Antropometria, UUID> {
    Optional<Antropometria> findByConsultaNutricional(ConsultaNutricional consultaNutricional);
}
