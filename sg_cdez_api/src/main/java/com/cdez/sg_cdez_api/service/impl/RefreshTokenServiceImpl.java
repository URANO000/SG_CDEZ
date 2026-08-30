package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.entity.RefreshToken;
import com.cdez.sg_cdez_api.repository.RefreshTokenRepository;
import com.cdez.sg_cdez_api.service.RefreshTokenService;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import java.time.Duration;
import java.time.LocalDateTime;

import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl
        implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    private final SecureRandom secureRandom =
            new SecureRandom();

    @Value("${refresh.expirationMs}")
    private long refreshExpirationMs;

    @Override
    @Transactional
    public String crearRefreshToken(Personal personal) {

        LocalDateTime expiresAt =
                LocalDateTime.now().plus(
                        Duration.ofMillis(
                                refreshExpirationMs
                        )
                );

        return crearRefreshToken(
                personal,
                expiresAt
        );
    }

    private String crearRefreshToken(
            Personal personal,
            LocalDateTime expiresAt
    ) {

        String token = generarTokenSeguro();
        RefreshToken refreshToken = new RefreshToken();

        LocalDateTime ahora = LocalDateTime.now();
        refreshToken.setRefreshTokenId(
                UUID.randomUUID()
        );

        refreshToken.setPersonal(personal);
        refreshToken.setTokenHash(generarHash(token));
        refreshToken.setRecordarme(true);
        refreshToken.setCreatedAt(ahora);
        refreshToken.setLastUsedAt(null);
        refreshToken.setExpiresAt(expiresAt);
        refreshToken.setRevocado(false);
        refreshToken.setRevokedAt(null);
        refreshTokenRepository.save(refreshToken);

        return token;
    }

    @Override
    public RefreshToken validarRefreshToken(
            String token
    ) {

        if (token == null || token.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Refresh token inválido."
            );
        }

        String tokenHash =
                generarHash(token);

        RefreshToken refreshToken =
                refreshTokenRepository
                        .findByTokenHash(tokenHash)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Refresh token inválido."
                                )
                        );

        if (refreshToken.isRevocado()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Refresh token revocado."
            );
        }

        if (
                refreshToken.getExpiresAt()
                        .isBefore(LocalDateTime.now())
        ) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Refresh token expirado."
            );
        }

        return refreshToken;
    }


    @Override
    @Transactional
    public String rotarRefreshToken(
            String token
    ) {

        RefreshToken actual =
                validarRefreshToken(token);

        LocalDateTime ahora =
                LocalDateTime.now();

        actual.setLastUsedAt(ahora);
        actual.setRevocado(true);
        actual.setRevokedAt(ahora);

        refreshTokenRepository.save(actual);

        return crearRefreshToken(
                actual.getPersonal(),
                actual.getExpiresAt()
        );
    }


    @Override
    @Transactional
    public void revocarToken(String token) {

        if (token == null || token.isBlank()) {
            return;
        }

        String tokenHash =
                generarHash(token);

        refreshTokenRepository
                .findByTokenHash(tokenHash)
                .ifPresent(refreshToken -> {

                    if (!refreshToken.isRevocado()) {
                        LocalDateTime ahora =
                                LocalDateTime.now();

                        refreshToken.setRevocado(
                                true
                        );

                        refreshToken.setRevokedAt(
                                ahora
                        );

                        refreshTokenRepository.save(
                                refreshToken
                        );
                    }
                });
    }


    @Override
    @Transactional
    public void revocarTodosPorPersonal(
            UUID personalId
    ) {

        List<RefreshToken> tokens =
                refreshTokenRepository
                        .findAllByPersonal_PersonalIdAndRevocadoFalse(
                                personalId
                        );

        if (tokens.isEmpty()) {
            return;
        }

        LocalDateTime ahora =
                LocalDateTime.now();

        tokens.forEach(token -> {
            token.setRevocado(true);
            token.setRevokedAt(ahora);
        });

        refreshTokenRepository.saveAll(tokens);
    }


    @Override
    public long getExpirationMs() {
        return refreshExpirationMs;
    }


    private String generarTokenSeguro() {

        byte[] bytes = new byte[64];

        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }


    private String generarHash(
            String token
    ) {

        try {
            MessageDigest digest =
                    MessageDigest.getInstance(
                            "SHA-256"
                    );

            byte[] hash =
                    digest.digest(
                            token.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            return HexFormat.of()
                    .formatHex(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "No fue posible generar el hash del refresh token.",
                    e
            );
        }
    }
}