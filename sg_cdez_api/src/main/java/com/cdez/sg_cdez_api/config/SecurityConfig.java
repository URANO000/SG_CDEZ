package com.cdez.sg_cdez_api.config;

import com.cdez.sg_cdez_api.filter.JwtAuthFilter;
import jakarta.servlet.DispatcherType;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import org.springframework.http.HttpMethod;


import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    @Value("${app.frontend-url}")
    private String frontendUrl;
    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    /**
     * Configuración principal de seguridad
     * Define reglas de acceso de los endpoints y el setup del filtro de JWT
     */

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                //Disabling de CSRF porque no se requiere para stateless JWT
                .csrf(csrf -> csrf.disable())

                // From MDN Observatory recommendations :)
                .headers(headers -> headers
                        .frameOptions(frameOptions ->
                                frameOptions.deny()
                        )

                        .contentSecurityPolicy(csp ->
                                csp.policyDirectives(
                                        "default-src 'self'; " +
                                                "base-uri 'self'; " +
                                                "object-src 'none'; " +
                                                "frame-ancestors 'none'; " +
                                                "form-action 'self'"
                                )
                        )
                )

                //Configurar reglas de autorización
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/iniciarSesion").permitAll()
                        .requestMatchers("/api/auth/forgot-password").permitAll()
                        .requestMatchers("/api/auth/restablecer-contrasena").permitAll()
                        .requestMatchers("/api/auth/cambiarContrasena/**").permitAll()
                        .requestMatchers("/api/auth/refresh").permitAll()
                        .requestMatchers("/api/auth/session").hasAnyRole("PERSONAL", "ADMIN",  "AYUDANTE")
                        .requestMatchers("/api/auth/activar").permitAll()
                        .requestMatchers("/api/auth/reenviar-verificacion").permitAll()

                        .requestMatchers("/api/perfil/**").hasAnyRole("PERSONAL", "ADMIN",  "AYUDANTE")
                                // Registrar adultos mayores: solo ADMIN y AYUDANTE.
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/adultos-mayores"
                                )
                                .hasAnyRole("ADMIN", "AYUDANTE")
                                // Registrar encargados legales: solo ADMIN y AYUDANTE.
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/adultos-mayores/*/encargados"
                                )
                                .hasAnyRole("ADMIN", "AYUDANTE")

                                // Registrar epicrisis: solo ADMIN y AYUDANTE.
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/adultos-mayores/*/epicrisis"
                                )
                                .hasAnyRole("ADMIN", "AYUDANTE")
                                // Editar adultos mayores: solo ADMIN y AYUDANTE.
                                .requestMatchers(
                                        HttpMethod.PUT,
                                        "/api/adultos-mayores/**"
                                )
                                .hasAnyRole("ADMIN", "AYUDANTE")

                                // Activar, desactivar o registrar fallecimiento.
                                .requestMatchers(
                                        HttpMethod.PATCH,
                                        "/api/adultos-mayores/**"
                                )
                                .hasAnyRole("ADMIN", "AYUDANTE")

                                // Consultar el expediente: todos los roles autenticados.
                                .requestMatchers("/api/adultos-mayores/**")
                                .hasAnyRole("PERSONAL", "ADMIN", "AYUDANTE")
                                // Editar o desactivar encargados: solo ADMIN y AYUDANTE.
                                .requestMatchers(
                                        HttpMethod.PUT,
                                        "/api/encargados/**"
                                )
                                .hasAnyRole("ADMIN", "AYUDANTE")
                                .requestMatchers(
                                        HttpMethod.PATCH,
                                        "/api/encargados/**"
                                )
                                .hasAnyRole("ADMIN", "AYUDANTE")
                                // Consultar encargados: todos los roles autenticados.
                                .requestMatchers("/api/encargados/**")
                                .hasAnyRole("PERSONAL", "ADMIN", "AYUDANTE")
                                // Editar o desactivar epicrisis: solo ADMIN y AYUDANTE.
                                .requestMatchers(
                                        HttpMethod.PUT,
                                        "/api/epicrisis/**"
                                )
                                .hasAnyRole("ADMIN", "AYUDANTE")

                                .requestMatchers(
                                        HttpMethod.PATCH,
                                        "/api/epicrisis/**"
                                )
                                .hasAnyRole("ADMIN", "AYUDANTE")

                                // Consultar, visualizar y descargar epicrisis: todos los roles.
                                .requestMatchers("/api/epicrisis/**")
                                .hasAnyRole("PERSONAL", "ADMIN", "AYUDANTE")
                        .requestMatchers("/api/documentos/**").hasAnyRole("PERSONAL", "ADMIN",  "AYUDANTE")
                        .requestMatchers("/api/auditorias/**").hasAnyRole("ADMIN",  "AYUDANTE")
                        .requestMatchers("/api/medicamentos/**").hasAnyRole("ADMIN",  "AYUDANTE", "PERSONAL")

                        .requestMatchers("/api/personal/listarPersonalFiltrado").hasAnyRole("ADMIN", "PERSONAL", "AYUDANTE")
                        .requestMatchers("/api/personal/obtenerPersonalPorId/**").hasRole("ADMIN")
                        .requestMatchers("/api/personal/crearPersonal").hasRole("ADMIN")
                        .requestMatchers("/api/personal/actualizarPersonal/**").hasRole("ADMIN")
                        .requestMatchers("/api/personal/activarPersonal/**").hasRole("ADMIN")
                        .requestMatchers("/api/personal/desactivarPersonal/**").hasRole("ADMIN")
                        .requestMatchers("/api/personal/reportePDF").hasRole("ADMIN")
                        .requestMatchers("/api/personal/reporteExcel").hasRole("ADMIN")
                        .requestMatchers("/api/dashboard/admin").hasRole("ADMIN")
                        .requestMatchers("/api/dashboard/personal").hasRole("PERSONAL")
                        .requestMatchers("/api/dashboard/ayudante").hasRole("AYUDANTE")


                        .requestMatchers("/api/consulta/**").hasAnyRole("PERSONAL", "AYUDANTE")
                        .requestMatchers("/api/consulta-nutricional/**").hasAnyRole("PERSONAL",  "AYUDANTE")
                        .requestMatchers("/api/consulta-psych/**").hasAnyRole("PERSONAL", "AYUDANTE")

                        .requestMatchers("/error").permitAll()
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                        .anyRequest().authenticated()
                )

                //No se guarda la sesión en el servidor
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                //Utilizamos es proveedor de autenticación customizado
                .authenticationProvider(authenticationProvider())

                //Agregar el filtro de JWT creado antes del filtro estándar
                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .addFilterBefore(
                        new OriginValidationFilter(frontendUrl),
                        JwtAuthFilter.class
                );
        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    //Utiliza BCrypt
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(frontendUrl));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
