package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="Contacto")
public class Contacto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int contactoId;
    @ManyToOne
    @JoinColumn(name = "personal_id", nullable = true)
    private Personal personal;
    @ManyToOne
    @JoinColumn(name = "encargado_id", nullable = true)
    private EncargadoLegal encargado;
    private String valor;
    private String tipoValor;

}
