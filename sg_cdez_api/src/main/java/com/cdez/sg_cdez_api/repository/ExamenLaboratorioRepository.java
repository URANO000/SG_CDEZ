package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.ExamenLaboratorio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ExamenLaboratorioRepository extends JpaRepository<ExamenLaboratorio, UUID> {
}
