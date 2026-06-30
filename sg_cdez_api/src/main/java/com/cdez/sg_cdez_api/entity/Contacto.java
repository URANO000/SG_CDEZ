package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="contacto")
public class Contacto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int contactoId;
    @ManyToOne
    @JoinColumn(name = "personal_id")
    private Personal personal;
    @ManyToOne
    @JoinColumn(name = "encargado_id")
    private EncargadoLegal encargado;
    private String valor;
    private String tipoValor;

}
