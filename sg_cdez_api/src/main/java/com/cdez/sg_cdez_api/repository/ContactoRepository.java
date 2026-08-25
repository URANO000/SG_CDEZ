package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.Contacto;
import com.cdez.sg_cdez_api.entity.EncargadoLegal;
import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContactoRepository extends JpaRepository<Contacto, Integer> {
    List<Contacto> findByPersonalAndActivoTrue(Personal personal);
    List<Contacto> findByEncargado(EncargadoLegal encargadoLegal);
    Optional<Contacto> findByContactoIdAndPersonalPersonalId(Integer contactoId, UUID personalId);
}
