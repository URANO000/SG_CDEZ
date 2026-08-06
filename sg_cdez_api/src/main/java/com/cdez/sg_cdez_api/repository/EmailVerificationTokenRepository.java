package com.cdez.sg_cdez_api.repository;

import com.cdez.sg_cdez_api.entity.EmailVerificationToken;
import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, UUID> {
    Optional<EmailVerificationToken> findByToken(String token);
    List<EmailVerificationToken> findByPersonalAndUsedFalse(Personal personal);
}
