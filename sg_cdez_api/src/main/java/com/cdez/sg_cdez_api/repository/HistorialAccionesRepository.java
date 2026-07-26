package com.cdez.sg_cdez_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistorialAccionesRepository extends JpaRepository<HistorialAccionesRepository, Integer> {
}
