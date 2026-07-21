package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "epicrisis")
public class Epicrisis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "epicrisis_id")
    private UUID epicrisisId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "documento_id", nullable = false)
    private Documento documento;

    @Column(name = "fecha_emision", nullable = false)
    private LocalDateTime fechaEmision;

    @Column(name = "fecha_recepcion")
    private LocalDateTime fechaRecepcion;

    @Column(name = "centro_salud", nullable = false, length = 150)
    private String centroSalud;

    @Column(name = "vigente", nullable = false)
    private Boolean vigente;
}