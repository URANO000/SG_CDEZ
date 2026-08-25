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

                //Configurar reglas de autorización
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/iniciarSesion").permitAll()
                        .requestMatchers("/api/auth/forgot-password").permitAll()
                        .requestMatchers("/api/auth/restablecer-contrasena").permitAll()
                        .requestMatchers("/api/auth/cambiarContrasena/**").permitAll()
                        .requestMatchers("/api/auth/session").hasAnyRole("PERSONAL", "ADMIN",  "AYUDANTE")
                        .requestMatchers("/api/auth/activar").permitAll()
                        .requestMatchers("/api/auth/reenviar-verificacion").permitAll()

                        .requestMatchers("/api/perfil/**").hasAnyRole("PERSONAL", "ADMIN",  "AYUDANTE")
                        // Solo el rol ADMIN puede registrar adultos mayores
                        .requestMatchers(HttpMethod.POST, "/api/adultos-mayores").hasAnyRole("ADMIN",  "AYUDANTE")

                        // Los roles PERSONAL y ADMIN pueden acceder al resto de operaciones del módulo
                        .requestMatchers("/api/adultos-mayores/**").hasAnyRole("PERSONAL", "ADMIN",  "AYUDANTE")

                        .requestMatchers("/api/epicrisis/**").hasAnyRole("ADMIN", "PERSONAL",  "AYUDANTE")
                        .requestMatchers("/api/encargados/**").hasAnyRole("PERSONAL", "ADMIN",  "AYUDANTE")
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


                        .requestMatchers("/api/consulta/**").hasAnyRole("PERSONAL", "AYUDANTE")
                        .requestMatchers("/api/consulta-nutricional/**").hasAnyRole("PERSONAL",  "AYUDANTE")

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
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
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
