package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.service.RateLimiterService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class RateLimiterServiceImpl implements RateLimiterService {
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    public boolean permitirLogin(String ip, String usuario) {
        return false;
    }

    @Override
    public boolean permitirForgotPassword(String ip, String correo) {
        return false;
    }

    @Override
    public boolean permitirReenvioVerificacion(String ip, String correo) {
        return false;
    }

    @Override
    public boolean permitir(String key, int capacidad, Duration ventana) {
        Bucket bucket = buckets.computeIfAbsent(key, k-> crearBucket(capacidad, ventana));
        return bucket.tryConsume(1);
    }

    private Bucket crearBucket(int capacidad, Duration ventana){

        Bandwidth limit = Bandwidth.builder()
                .capacity(capacidad)
                .refillGreedy(capacidad, ventana)
                .build();

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}
