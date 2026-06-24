package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Async
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender MAIL_SENDER;

    @Override
    public void enviarCredenciales(String correo, String passwordTemp) {
        SimpleMailMessage mensaje = new SimpleMailMessage();

        mensaje.setTo(correo);
        mensaje.setSubject("Credenciales de acceso");


        mensaje.setText(
                """
                Su cuenta ha sido creada.

                Usuario: %s
                Contraseña temporal: %s

                Debe cambiar esta contraseña en su primer inicio de sesión.
                """
                        .formatted(correo, passwordTemp)
        );

        MAIL_SENDER.send(mensaje);
    }
}
