package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="contacto")
public class Contacto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer contactoId;
    @ManyToOne
    @JoinColumn(name = "personal_id")
    private Personal personal;
    @ManyToOne
    @JoinColumn(name = "encargado_id")
    private EncargadoLegal encargado;
    private String valor;
    private String tipoValor;
    private boolean activo;

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
