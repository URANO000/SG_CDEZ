package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name="historialacciones")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HistorialAcciones {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int historialId;
    private String accion;
    private String campoAfectado;
    private String valorAnterior;
    private String valorNuevo;
    private String descripcion;

    private LocalDateTime performedAt;
    @ManyToOne
    @JoinColumn(name="performed_by", nullable = false)
    private Personal performedBy;
}
