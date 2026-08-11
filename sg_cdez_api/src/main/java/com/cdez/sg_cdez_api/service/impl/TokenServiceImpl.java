package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.repository.*;
import com.cdez.sg_cdez_api.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final EmailVerificationTokenRepository VERIFICATION_REPOSITORY;
    private final PasswordResetTokenRepository RESET_REPOSITORY;
    private final EmailService EMAIL_SERVICE;

    @Override
    public void verificacionCrearYEnviar(Personal personal) {
       generarYEnviarVerificacionToken(personal);
    }

    @Override
    public void generarYEnviarVerificacionToken(Personal personal) {
        List<EmailVerificationToken> tokens = VERIFICATION_REPOSITORY.findByPersonalAndUsadoFalse(personal);
        tokens.forEach(token -> token.setUsado(true));

        EmailVerificationToken token = new EmailVerificationToken();

        token.setPersonal(personal);
        token.setToken(UUID.randomUUID().toString());
        token.setUsado(false);
        token.setExpiresAt(LocalDateTime.now().plusHours(24));

        VERIFICATION_REPOSITORY.save(token);

        EMAIL_SERVICE.enviarCorreoVerificacion(
                personal.getUsuario(),
                token.getToken(),
                personal.getNombreCompleto()
        );
    }

    @Override
    public void generarYEnviarResetToken(Personal personal) {
        List<PasswordResetToken> tokens = RESET_REPOSITORY.findByPersonalAndUsadoFalse(personal);
        tokens.forEach(token -> token.setUsado(true));

        PasswordResetToken token = new PasswordResetToken();

        token.setPersonal(personal);
        token.setToken(UUID.randomUUID().toString());
        token.setUsado(false);
        token.setExpiresAt(LocalDateTime.now().plusHours(24));

        RESET_REPOSITORY.save(token);

        EMAIL_SERVICE.enviarCorreoReset(
                personal.getUsuario(),
                token.getToken(),
                personal.getNombreCompleto()
        );
    }


}
