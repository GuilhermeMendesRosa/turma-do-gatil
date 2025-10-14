package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.config.JwtUtil;
import br.com.udesc.turma_do_gatil_back.dto.CreateUserRequestDto;
import br.com.udesc.turma_do_gatil_back.dto.LoginRequestDto;
import br.com.udesc.turma_do_gatil_back.dto.LoginResponseDto;
import br.com.udesc.turma_do_gatil_back.dto.UserDto;
import br.com.udesc.turma_do_gatil_back.entities.User;
import br.com.udesc.turma_do_gatil_back.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public UserDto createUser(CreateUserRequestDto request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username já existe");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        return new UserDto(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getName(),
                savedUser.getCreatedAt()
        );
    }

    public LoginResponseDto login(LoginRequestDto request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Username ou password inválidos");
        }

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String token = jwtUtil.generateToken(user.getUsername());

        return new LoginResponseDto(token, user.getUsername(), user.getName());
    }
}
