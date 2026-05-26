package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.AdultoMayor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AdultoMayorRepository extends JpaRepository<AdultoMayor, UUID> {
}