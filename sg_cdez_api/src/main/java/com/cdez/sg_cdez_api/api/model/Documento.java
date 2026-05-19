package com.cdez.sg_cdez_api.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Documento")
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
