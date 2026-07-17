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

    @Column(name = "nombre_archivo", nullable = false, length = 200)
    private String nombreArchivo;

    @Column(name = "tipo_archivo", nullable = false, length = 100)
    private String tipoArchivo;

    @Column(name = "tamano_archivo", nullable = false)
    private Long tamanoArchivo;

    @Column(name = "vigente", nullable = false)
    private Boolean vigente;

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private Personal createdBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private Personal updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}