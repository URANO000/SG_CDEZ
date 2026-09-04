package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.ConsultaPsych;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface ConsultaPsychRepository extends JpaRepository<ConsultaPsych, UUID> {
    List<ConsultaPsych> findByConsultaActivoTrue();
    List<ConsultaPsych> findAllByConsultaConsultaIdIn(Collection<UUID> consultaIds);

}
