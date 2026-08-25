package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Async
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender MAIL_SENDER;
    private final TemplateEngine TEMPLATE_ENGINE;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void enviarCorreoVerificacion(String usuario, String token, String nombre) {

        String enlace = frontendUrl + "/activar?token=" + token;
        String imageResourceName = "zurquiLogo";

        Context context = new Context();
        context.setVariable("enlace", enlace);
        context.setVariable("nombre", nombre);
        context.setVariable(
                "imageResourceName",
                imageResourceName
        );

        String html = TEMPLATE_ENGINE.process("activacion-email", context);

        try{
            MimeMessage mensaje = MAIL_SENDER.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje,true, "UTF-8");
            helper.setTo(usuario);
            helper.setSubject("Activación de cuenta");
            helper.setText(html, true);

            ClassPathResource logo =
                    new ClassPathResource(
                            "static/zurqui-logo.png"
                    );

            helper.addInline(
                    imageResourceName,
                    logo,
                    "image/png"
            );
            MAIL_SENDER.send(mensaje);
        }catch (MessagingException e) {
            throw new RuntimeException("Error enviando correo de verificación", e);
        }
    }

    @Override
    public void enviarCorreoReset(String usuario, String token, String nombre) {
        String enlace = frontendUrl + "/restablecer-contrasena?token=" + token;
        String imageResourceName = "zurquiLogo";

        Context context = new Context();
        context.setVariable("enlace", enlace);
        context.setVariable("nombre", nombre);
        context.setVariable(
                "imageResourceName",
                imageResourceName
        );

        String html = TEMPLATE_ENGINE.process("restablecer-contrasena", context);

        try{
            MimeMessage mensaje = MAIL_SENDER.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje,true, "UTF-8");
            helper.setTo(usuario);
            helper.setSubject("Restablecer contraseña");
            helper.setText(html, true);
            ClassPathResource logo =
                    new ClassPathResource(
                            "static/zurqui-logo.png"
                    );

            helper.addInline(
                    imageResourceName,
                    logo,
                    "image/png"
            );
            MAIL_SENDER.send(mensaje);
        }catch (MessagingException e) {
            throw new RuntimeException("Error enviando correo de restablecimiento de contraseña", e);
        }

    }

    @Override
    public void enviarCorreoReferencia(String correoReceptor, String nombreReceptor, String nombreEmisor, String especialidadEmisor, String nombreAdultoMayor, String mensaje, String consultaId) {
        String enlace =  frontendUrl + "/consulta/" + consultaId + "/detalle";
        Context context = new Context();

        String imageResourceName = "zurquiLogo";

        context.setVariable("enlace", enlace);

        context.setVariable("nombreReceptor", nombreReceptor);
        context.setVariable("nombreEmisor", nombreEmisor);
        context.setVariable("especialidadEmisor", especialidadEmisor);
        context.setVariable("nombreAdultoMayor", nombreAdultoMayor);
        context.setVariable("mensajeReferencia", mensaje);
        context.setVariable(
                "imageResourceName",
                imageResourceName
        );

        String html = TEMPLATE_ENGINE.process("referencia", context);

        try{
            MimeMessage message = MAIL_SENDER.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(correoReceptor);
            helper.setSubject("Nueva referencia - " + nombreAdultoMayor);
            helper.setText(html, true);
            ClassPathResource logo =
                    new ClassPathResource(
                            "static/zurqui-logo.png"
                    );

            helper.addInline(
                    imageResourceName,
                    logo,
                    "image/png"
            );

            MAIL_SENDER.send(message);

        } catch (MessagingException e){
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error enviando correo de referencia",
                    e
            );
        }


    }
}
