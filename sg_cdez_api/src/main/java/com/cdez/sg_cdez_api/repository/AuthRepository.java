package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;
import java.util.UUID;

public interface AuthRepository extends JpaRepository<Personal, UUID> {
    Optional<Personal> findByUsuario(String usuario);
    Optional<Personal> findByPersonalId(UUID id);
}
