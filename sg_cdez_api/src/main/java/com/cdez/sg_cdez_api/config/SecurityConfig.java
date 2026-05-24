package com.cdez.sg_cdez_api.config;

import com.cdez.sg_cdez_api.filter.JwtAuthFilter;
import com.cdez.sg_cdez_api.repository.AuthRepository;
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
                //Disabling de CSRF porque no se requiere para stateless JWT
                .csrf(csrf -> csrf.disable())

                //Configurar reglas de autorización
                .authorizeHttpRequests(auth -> auth
                //Endpoints públicos
                                .requestMatchers("/api/auth/**").permitAll()
                                .requestMatchers("/api/public/**").permitAll()
                                .requestMatchers("/adultos-mayores/**").permitAll()
                //Todoo lo demás requiere autenticación y autorización
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

}
