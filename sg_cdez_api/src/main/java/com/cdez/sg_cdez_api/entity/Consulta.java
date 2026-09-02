package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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

    @OneToOne(
            mappedBy = "consulta",
            fetch = FetchType.LAZY
    )
    private ConsultaNutricional consultaNutricional;

    @OneToOne(
            mappedBy = "consulta",
            fetch = FetchType.LAZY
    )
    private ConsultaPsych consultaPsych;

    @OneToMany(
            mappedBy = "consulta",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Tamizaje> tamizajes = new ArrayList<>();

    public void agregarTamizaje(Tamizaje tamizaje) {
        tamizajes.add(tamizaje);
        tamizaje.setConsulta(this);
    }

    public void eliminarTamizaje(Tamizaje tamizaje) {
        tamizajes.remove(tamizaje);
        tamizaje.setConsulta(null);
    }
}
