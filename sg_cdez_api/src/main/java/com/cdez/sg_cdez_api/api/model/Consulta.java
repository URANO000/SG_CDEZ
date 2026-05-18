package com.cdez.sg_cdez_api.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Consulta")
public class Consulta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int consultaId;
    @ManyToOne
    @JoinColumn(name = "adulto_id", nullable = false)
    private AdultoMayor adultoMayor;
    @ManyToOne
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;
    private String motivo;
    private String tipoIntervencion;
    private String descripcion;
    private String diagnostico;
    private String recomendaciones;
    private String notas;
    @ManyToOne
    @JoinColumn(name="referencia", nullable = true)
    private Personal referencia;
    @ManyToOne
    @JoinColumn(name="created_by", nullable = false )
    private Personal createdBy;
    private LocalDateTime createdAt;
}
