package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentoRepository extends JpaRepository<Documento, Integer> {
}