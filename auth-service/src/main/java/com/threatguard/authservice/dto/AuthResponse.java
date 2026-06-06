package com.threatguard.authservice.dto;

public record AuthResponse(String token, long expiresInMs) {
}
