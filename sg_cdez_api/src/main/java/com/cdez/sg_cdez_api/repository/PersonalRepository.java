package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PersonalRepository extends JpaRepository<Personal, UUID> {
    @Override
    List<Personal> findAll();

    @Override
    Optional<Personal> findById(UUID uuid);
}
