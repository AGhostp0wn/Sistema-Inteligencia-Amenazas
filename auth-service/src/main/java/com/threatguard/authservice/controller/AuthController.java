package com.threatguard.authservice.controller;

import com.threatguard.authservice.dto.AuthResponse;
import com.threatguard.authservice.dto.LoginRequest;
import com.threatguard.authservice.dto.ProfileResponse;
import com.threatguard.authservice.dto.RegisterRequest;
import com.threatguard.authservice.entity.User;
import com.threatguard.authservice.service.AuthService;
import jakarta.validation.Valid;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/profile")
    public ProfileResponse profile(Authentication authentication) {
        // authentication.getName() will be the token subject (email)
        User user = authService.getByEmail(authentication.getName());
        Set<String> roles = AuthService.toRoleStrings(user);
        return new ProfileResponse(user.getId(), user.getUsername(), user.getEmail(), roles);
    }
}
