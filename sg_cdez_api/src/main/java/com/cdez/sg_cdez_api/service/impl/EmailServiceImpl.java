package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Async
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender MAIL_SENDER;
    private final TemplateEngine TEMPLATE_ENGINE;

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

    @Override
    public void enviarCorreoVerificacion(String usuario, String token, String nombre) {

        String enlance = "http://localhost:5173/activar?token=" + token;

        Context context = new Context();
        context.setVariable("enlance", enlance);
        context.setVariable("nombre", nombre);

        String html = TEMPLATE_ENGINE.process("activacion-email", context);

        try{
            MimeMessage mensaje = MAIL_SENDER.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, "UTF-8");
            helper.setTo(usuario);
            helper.setSubject("Activación de cuenta");
            helper.setText(html, true);
            MAIL_SENDER.send(mensaje);
        }catch (MessagingException e) {
            throw new RuntimeException("Error enviando correo de verificación", e);
        }
    }
}
