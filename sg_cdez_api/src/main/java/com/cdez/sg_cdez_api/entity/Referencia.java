package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "referencia")
public class Referencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "referencia_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "emisor_id", nullable = false)
    private Personal emisor;

    @ManyToOne
    @JoinColumn(name = "receptor_id", nullable = false)
    private Personal receptor;

    @ManyToOne
    @JoinColumn(name = "consulta_id", nullable = false)
    private Consulta consulta;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
