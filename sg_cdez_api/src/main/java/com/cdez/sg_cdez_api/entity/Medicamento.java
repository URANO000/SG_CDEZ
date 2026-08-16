package com.cdez.sg_cdez_api.entity;

import com.cdez.sg_cdez_api.entity.enums.TipoMedicamento;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "medicamento")
public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "medicamento_id")
    private UUID medicamentoId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "adulto_id",
            nullable = false
    )
    private AdultoMayor adulto;

    @Column(name = "nombre", nullable = false, length = 200)
    private String nombre;

    @Column(name = "dosis", length = 100)
    private String dosis;

    @Column(name = "horario", length = 100)
    private String horario;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", length = 50)
    private TipoMedicamento tipo;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "created_by",
            nullable = false
    )
    private Personal createdBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "updated_by",
            nullable = false
    )
    private Personal updatedBy;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "activo", nullable = false)
    private boolean activo;

}