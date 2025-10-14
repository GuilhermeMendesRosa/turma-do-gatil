package br.com.udesc.turma_do_gatil_back.controllers;

import br.com.udesc.turma_do_gatil_back.dto.CreateUserRequestDto;
import br.com.udesc.turma_do_gatil_back.dto.LoginRequestDto;
import br.com.udesc.turma_do_gatil_back.dto.LoginResponseDto;
import br.com.udesc.turma_do_gatil_back.dto.UserDto;
import br.com.udesc.turma_do_gatil_back.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${auth.registerEnabled}")
    private Boolean registerEnabled;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody CreateUserRequestDto request) {
        if (!registerEnabled) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        UserDto user = authService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        LoginResponseDto response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
