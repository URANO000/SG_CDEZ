package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "consultapsych")
public class ConsultaPsych {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "consulta_psych_id")
    private UUID consultaPsychId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "consulta_id",
            nullable = false,
            unique = true
    )
    private Consulta consulta;
}
