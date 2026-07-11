package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.Contacto;
import com.cdez.sg_cdez_api.entity.EncargadoLegal;
import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactoRepository extends JpaRepository<Contacto, Integer> {
    List<Contacto> findByPersonal(Personal personal);
    List<Contacto> findByEncargado(EncargadoLegal encargadoLegal);
}
