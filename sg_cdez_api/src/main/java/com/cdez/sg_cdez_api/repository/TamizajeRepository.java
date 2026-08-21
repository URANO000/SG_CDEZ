package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.TamizajeNutricional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TamizajeRepository extends JpaRepository<TamizajeNutricional, UUID> {
}
