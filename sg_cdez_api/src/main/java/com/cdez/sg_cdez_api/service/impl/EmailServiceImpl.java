package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;
import org.springframework.web.util.UriComponentsBuilder;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;

@Service
@RequiredArgsConstructor
@Async
public class EmailServiceImpl implements EmailService {
    private static final String BREVO_API_URL =
            "https://api.brevo.com/v3/smtp/email";

    private final TemplateEngine templateEngine;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${brevo.api-key}")
    private String brevoApiKey;

    @Value("${brevo.sender-email}")
    private String senderEmail;

    @Value("${brevo.sender-name}")
    private String senderName;

    @Override
    public void enviarCorreoVerificacion(
            String usuario,
            String token,
            String nombre
    ) {
        String enlace = crearEnlaceConToken("/activar", token);

        Context context = crearContextoBase();
        context.setVariable("enlace", enlace);
        context.setVariable("nombre", nombre);

        String html = templateEngine.process(
                "activacion-email",
                context
        );

        enviarCorreoBrevo(
                usuario,
                nombre,
                "Activación de cuenta",
                html
        );
    }


    @Override
    public void enviarCorreoReset(
            String usuario,
            String token,
            String nombre
    ) {
        String enlace = crearEnlaceConToken(
                "/restablecer-contrasena",
                token
        );

        Context context = crearContextoBase();
        context.setVariable("enlace", enlace);
        context.setVariable("nombre", nombre);

        String html = templateEngine.process(
                "restablecer-contrasena",
                context
        );

        enviarCorreoBrevo(
                usuario,
                nombre,
                "Restablecer contraseña",
                html
        );
    }

    @Override
    public void enviarCorreoReferencia(
            String correoReceptor,
            String nombreReceptor,
            String nombreEmisor,
            String especialidadEmisor,
            String nombreAdultoMayor,
            String mensaje,
            String consultaId
    ) {
        String enlace = UriComponentsBuilder
                .fromUriString(frontendUrl)
                .pathSegment(
                        "consulta",
                        consultaId,
                        "detalle"
                )
                .build()
                .toUriString();

        Context context = crearContextoBase();
        context.setVariable("enlace", enlace);
        context.setVariable(
                "nombreReceptor",
                nombreReceptor
        );
        context.setVariable(
                "nombreEmisor",
                nombreEmisor
        );
        context.setVariable(
                "especialidadEmisor",
                especialidadEmisor
        );
        context.setVariable(
                "nombreAdultoMayor",
                nombreAdultoMayor
        );
        context.setVariable(
                "mensajeReferencia",
                mensaje
        );

        String html = templateEngine.process(
                "referencia",
                context
        );

        enviarCorreoBrevo(
                correoReceptor,
                nombreReceptor,
                "Nueva referencia - " + nombreAdultoMayor,
                html
        );
    }

    private Context crearContextoBase() {
        Context context = new Context();

        context.setVariable(
                "logoUrl",
                frontendUrl + "/zurqui-logo.png"
        );

        return context;
    }

    private String crearEnlaceConToken(
            String ruta,
            String token
    ) {
        return UriComponentsBuilder
                .fromUriString(frontendUrl)
                .path(ruta)
                .queryParam("token", token)
                .build()
                .encode()
                .toUriString();
    }

    private void enviarCorreoBrevo(
            String destinatario,
            String nombreDestinatario,
            String asunto,
            String html
    ) {
        BrevoEmailRequest request = new BrevoEmailRequest(
                new ContactoBrevo(
                        senderEmail,
                        senderName
                ),
                List.of(
                        new ContactoBrevo(
                                destinatario,
                                nombreDestinatario
                        )
                ),
                asunto,
                html
        );

        try {
            RestClient.create()
                    .post()
                    .uri(BREVO_API_URL)
                    .header(
                            HttpHeaders.ACCEPT,
                            MediaType.APPLICATION_JSON_VALUE
                    )
                    .header(
                            HttpHeaders.CONTENT_TYPE,
                            MediaType.APPLICATION_JSON_VALUE
                    )
                    .header(
                            "api-key",
                            brevoApiKey
                    )
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();

        } catch (RestClientResponseException exception) {
            throw new RuntimeException(
                    "Brevo rechazó el correo. Código HTTP: "
                            + exception.getStatusCode()
                            + ". Respuesta: "
                            + exception.getResponseBodyAsString(),
                    exception
            );

        } catch (ResourceAccessException exception) {
            throw new RuntimeException(
                    "No se pudo conectar con el servicio de correo Brevo",
                    exception
            );
        }
    }

    private record BrevoEmailRequest(
            ContactoBrevo sender,
            List<ContactoBrevo> to,
            String subject,
            String htmlContent
    ) {
    }

    private record ContactoBrevo(
            String email,
            String name
    ) {
    }
}
