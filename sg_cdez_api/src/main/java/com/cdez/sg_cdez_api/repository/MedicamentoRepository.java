package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.AdultoMayor;
import com.cdez.sg_cdez_api.entity.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MedicamentoRepository extends JpaRepository<Medicamento, UUID> {
    List<Medicamento> findByAdultoAndActivoTrue(AdultoMayor adultoMayor);
}
