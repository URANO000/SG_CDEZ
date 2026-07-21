package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import java.util.UUID;

public interface PersonalRepository extends JpaRepository<Personal, UUID>, JpaSpecificationExecutor<Personal> {
    boolean existsByUsuario(String usuario);
    Optional<Personal> findByUsuario(String usuario);
    Page<Personal> findByEspecialidad(String especialidad, Pageable pageable);
    Page<Personal> findByActivo(boolean activo, Pageable pageable);

}
