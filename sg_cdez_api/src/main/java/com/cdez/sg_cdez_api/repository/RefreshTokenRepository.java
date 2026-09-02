package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenHash(
            String tokenHash
    );

    List<RefreshToken>
    findAllByPersonal_PersonalIdAndRevocadoFalse(
            UUID personalId
    );
}