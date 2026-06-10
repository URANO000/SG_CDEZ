package com.cdez.sg_cdez_api.filter;


import com.cdez.sg_cdez_api.service.CustomUserDetailsService;
import com.cdez.sg_cdez_api.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
    throws ServletException, IOException {

        //Get el header de autorización
        final String authHeader = request.getHeader("Authorization");

        //Si no hay header o no empieza con 'Bearer', salir de este filtro
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        try{
            //Si el formato es correcto, extraer toddo luego de Bearer
            final String jwt = authHeader.substring(7);
            final String userId = jwtService.extractUserId(jwt);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            //Si tenemos un username y no existe ninguna autenticación antes
            if(userId != null && authentication == null){
                //Cargar datos del usuario desde la base de datos
                UserDetails userDetails = this.userDetailsService.loadUserById(UUID.fromString(userId));

                //Validar el token
                if(jwtService.isTokenValid(jwt, userDetails)){
                    //Crear token de autenticacion
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    //Añadir detalles del request
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    //Set la autenticación en el security context
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }

            }
        }catch (Exception e){
            handlerExceptionResolver.resolveException(request, response, null, e);
        }

        filterChain.doFilter(request, response);

    }

}
