package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.Auditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface AuditoriaRepository extends JpaRepository<Auditoria, UUID>,
        JpaSpecificationExecutor<Auditoria> {
}