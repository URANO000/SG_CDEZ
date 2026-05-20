package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<Personal, Long> {
    Optional<Personal> encontrarPorUsuario(String usuario);
}
