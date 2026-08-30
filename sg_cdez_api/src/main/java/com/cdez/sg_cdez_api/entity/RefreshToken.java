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
@Table(name = "refreshtoken")
public class RefreshToken {

    @Id
    @Column(name = "refresh_token_id")
    private UUID refreshTokenId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "personal_id",
            nullable = false
    )
    private Personal personal;

    @Column(
            name = "token_hash",
            nullable = false,
            unique = true,
            length = 64
    )
    private String tokenHash;

    @Column(
            name = "recordarme",
            nullable = false
    )
    private boolean recordarme;

    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;

    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;

    @Column(
            name = "expires_at",
            nullable = false
    )
    private LocalDateTime expiresAt;

    @Column(
            name = "revocado",
            nullable = false
    )
    private boolean revocado;

    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;
}