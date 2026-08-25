package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.PasswordResetToken;
import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    List<PasswordResetToken> findByPersonalAndUsadoFalse(Personal personal);

    Optional<PasswordResetToken> findByToken(String token);
}
