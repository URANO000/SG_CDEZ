package com.cdez.sg_cdez_api.config;

import com.cdez.sg_cdez_api.filter.JwtAuthFilter;
import jakarta.servlet.DispatcherType;
import lombok.AllArgsConstructor;
import lombok.Data;
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

import java.util.List;

@Configuration
@Data
@AllArgsConstructor
public class SecurityConfig {
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
                        .requestMatchers("/api/auth/cambiarContrasena/**").hasAnyRole("PERSONAL", "ADMIN")
                        .requestMatchers("/api/auth/session").hasAnyRole("PERSONAL", "ADMIN")
                        .requestMatchers("/api/auth/activar").permitAll()

                        .requestMatchers("/api/perfil/**").hasAnyRole("PERSONAL", "ADMIN")

                        .requestMatchers("/api/adultos-mayores/**").hasAnyRole("PERSONAL", "ADMIN")
                        .requestMatchers("/api/epicrisis/**").hasAnyRole("ADMIN", "PERSONAL")
                        .requestMatchers("/api/encargados/**").hasAnyRole("PERSONAL", "ADMIN")
                        .requestMatchers("/api/documentos/**").hasAnyRole("PERSONAL", "ADMIN")
                        .requestMatchers("/api/auditorias/**").hasRole("ADMIN")
                        .requestMatchers("/api/personal/**").hasRole("ADMIN")

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
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
