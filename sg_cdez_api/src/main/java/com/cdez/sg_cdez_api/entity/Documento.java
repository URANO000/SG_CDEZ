package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "documento")
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "documento_id")
    private Integer documentoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id")
    private Personal personal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encargado_id")
    private EncargadoLegal encargadoLegal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adulto_id")
    private AdultoMayor adultoMayor;

    @Column(name = "nombre_archivo", nullable = false, length = 200)
    private String nombreArchivo;

    @Column(name = "tipo_archivo", nullable = false, length = 100)
    private String tipoArchivo;

    @Column(name = "tamano_archivo", nullable = false)
    private Long tamanoArchivo;

    @Column(name = "archivo", nullable = false)
    private byte[] archivo;

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