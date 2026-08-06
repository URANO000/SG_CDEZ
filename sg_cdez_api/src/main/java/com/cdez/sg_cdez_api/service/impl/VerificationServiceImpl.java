package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.entity.EmailVerificationToken;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.EmailVerificationTokenRepository;
import com.cdez.sg_cdez_api.service.EmailService;
import com.cdez.sg_cdez_api.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationServiceImpl implements VerificationService {
    private final EmailVerificationTokenRepository REPOSITORY;
    private final EmailService EMAIL_SERVICE;

    @Override
    public void verificacionCrearYEnviar(Personal personal) {
       generarYEnviarToken(personal);
    }

    @Override
    public void generarYEnviarToken(Personal personal) {
        List<EmailVerificationToken> tokens = REPOSITORY.findByPersonalAndUsadoFalse(personal);
        tokens.forEach(token -> token.setUsado(true));

        EmailVerificationToken token = new EmailVerificationToken();

        token.setPersonal(personal);
        token.setToken(UUID.randomUUID().toString());
        token.setUsado(false);
        token.setExpiresAt(LocalDateTime.now().plusHours(24));

        REPOSITORY.save(token);

        EMAIL_SERVICE.enviarCorreoVerificacion(
                personal.getUsuario(),
                token.getToken()
        );
    }


}
