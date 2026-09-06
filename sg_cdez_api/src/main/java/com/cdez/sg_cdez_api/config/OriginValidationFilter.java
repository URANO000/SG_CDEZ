package com.cdez.sg_cdez_api.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

public class OriginValidationFilter
        extends OncePerRequestFilter {

    private static final Set<String> SAFE_METHODS =
            Set.of("GET", "HEAD", "OPTIONS", "TRACE");

    private final String allowedOrigin;

    public OriginValidationFilter(String allowedOrigin) {
        this.allowedOrigin = allowedOrigin;
    }

    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request
    ) {
        return SAFE_METHODS.contains(request.getMethod());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String origin =
                request.getHeader(HttpHeaders.ORIGIN);

        if (
                origin != null
                        && !origin.equals(allowedOrigin)
        ) {
            response.sendError(
                    HttpServletResponse.SC_FORBIDDEN,
                    "Origen no permitido."
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}