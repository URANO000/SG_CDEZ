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
@Table(name = "consulta")
public class Consulta {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID consultaId;
    @ManyToOne
    @JoinColumn(name = "adulto_id", nullable = false)
    private AdultoMayor adultoMayor;
    private String tipoConsulta;
    private String motivo;
    private String descripcion;
    private String diagnostico;
    private String resultadosEvaluaciones;
    private String recomendaciones;
    private String notas;
    private boolean activo;
    @ManyToOne
    @JoinColumn(name="created_by", nullable = false )
    private Personal createdBy;
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "updated_by", nullable = true)
    private Personal updatedBy;
    private LocalDateTime updatedAt;
}
