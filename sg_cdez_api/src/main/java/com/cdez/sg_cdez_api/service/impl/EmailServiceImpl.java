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

    @Override
    public void enviarCorreoVerificacion(String usuario, String token) {

        String enlance = "http://localhost:5173/activar?token=" + token;

        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(usuario);
        mensaje.setSubject("Activación de cuenta");

        mensaje.setText("""
                        Bienvenido/a.
                                
                        Se ha creado una cuenta para usted.
                                
                        Antes de utilizar el sistema debe activar su cuenta.
                                
                        Haga clic en el siguiente enlace:
                                
                        %s
                                
                        Este enlace expirará en 24 horas.
                
                """.formatted(enlance));

        MAIL_SENDER.send(mensaje);
    }
}
