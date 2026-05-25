package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "documento")
public class Documento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int documentoId;
    @ManyToOne
    @JoinColumn(name = "personal_id", nullable = true)
    private Personal personal;
    @ManyToOne
    @JoinColumn(name = "encargado_id", nullable = true)
    private EncargadoLegal encargadoLegal;
    @ManyToOne
    @JoinColumn(name = "adulto_id", nullable = true)
    private AdultoMayor adultoMayor;
    private byte[] archivo;

}
