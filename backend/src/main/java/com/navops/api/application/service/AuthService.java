package com.navops.api.application.service;

import com.navops.api.application.dto.request.LoginRequest;
import com.navops.api.application.dto.response.auth.LoginResponseDto;
import com.navops.api.application.dto.response.auth.ProfileResponseDto;
import com.navops.api.application.dto.response.auth.VerifyCodeResponseDto;
import com.navops.api.domain.entity.LoginAttempt;
import com.navops.api.domain.entity.PasswordResetCode;
import com.navops.api.domain.entity.Person;
import com.navops.api.domain.entity.User;
import com.navops.api.infrastructure.exception.ExpiredResetCodeException;
import com.navops.api.infrastructure.exception.InvalidResetCodeException;
import com.navops.api.infrastructure.exception.UserNotFoundException;
import com.navops.api.repository.LoginAttemptRepository;
import com.navops.api.repository.PasswordResetCodeRepository;
import com.navops.api.repository.PersonRepository;
import com.navops.api.repository.UserRepository;
import com.navops.api.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PersonRepository personRepository;
    private final LoginAttemptRepository loginAttemptRepository;
    private final PasswordResetCodeRepository passwordResetCodeRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final HttpServletRequest request;
    private final PasswordEncoder passwordEncoder;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCKOUT_MINUTES = 15;

    @Transactional
    public LoginResponseDto login(LoginRequest loginRequest) {
        String ipAddress = getClientIp(request);
        String username = loginRequest.username();

        //Comprueba si el usuario/IP está bloqueado
        checkLockoutStatus(username, ipAddress);

        try {
            // Validar credenciales mediante Spring Security
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, loginRequest.password())
            );

            // Registro exitoso
            recordLoginAttempt(username, ipAddress, true);

            // Generar token y formular respuesta
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado tras autenticación exitosa"));

            String roleName = user.getRole().getName();
            String jwtToken = jwtService.generateToken(new HashMap<>(), user);

            String redirectUrl = determineRedirectUrl(roleName);

            return new LoginResponseDto(jwtToken, user.getId(), roleName, redirectUrl);

        } catch (BadCredentialsException ex) {

            recordLoginAttempt(username, ipAddress, false);
            log.warn("Intento de inicio de sesión fallido para el nombre de usuario: {} desde la IP: {}", username, ipAddress);
            throw new BadCredentialsException("Usuario o contraseña incorrectos");
        }
    }

    public ProfileResponseDto getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        Person person = personRepository.findByUser(user)
                .orElseThrow(UserNotFoundException::new);

        return new ProfileResponseDto(
                person.getFullName(),
                person.getSurname(),
                person.getAvatarUrl(),
                user.getRole().getName()
        );
    }

    private void checkLockoutStatus(String username, String ipAddress) {
        OffsetDateTime lockoutTimeWindow = OffsetDateTime.now().minusMinutes(LOCKOUT_MINUTES);

        int failedAttempts = loginAttemptRepository.countByUsernameAndSuccessFalseAndAttemptTimeAfter(username, lockoutTimeWindow);

        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
            log.warn("El usuario {} está bloqueado temporalmente debido a un número excesivo de intentos fallidos de inicio de sesión.", username);
            throw new LockedException("Demasiados intentos fallidos. Su cuenta está bloqueada temporalmente por " + LOCKOUT_MINUTES + " minutos.");
        }
    }

    private void recordLoginAttempt(String username, String ipAddress, boolean success) {
        LoginAttempt attempt = LoginAttempt.builder()
                .username(username)
                .ipAddress(ipAddress)
                .success(success)
                .build();
        loginAttemptRepository.save(attempt);
    }

    private String getClientIp(HttpServletRequest request) {

        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String determineRedirectUrl(String roleName) {
        return switch (roleName.toUpperCase()) {
            case "ADMIN" -> "/dashboard/admin";
            case "CHIEF_NAVIGATION" -> "/dashboard/navigation";
            case "CHIEF_OPERATIONS" -> "/dashboard/operations";
            default -> "/";
        };
    }

    @Transactional
    public void forgotPassword(String email) {
        log.info("Iniciando proceso de recuperación de contraseña para: {}", email);
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            log.warn("Intento de recuperación para correo inexistente: {}", email);
            return new UserNotFoundException();
        });

        String code = generateSecureCode(8);
        String formattedCode = formatCode(code);

        PasswordResetCode resetCode = PasswordResetCode.builder()
                .user(user)
                .code(code)
                .expiresAt(OffsetDateTime.now().plusMinutes(5))
                .build();

        passwordResetCodeRepository.save(resetCode);
        emailService.sendPasswordRecoveryEmail(user.getEmail(), formattedCode);
        log.info("Correo enviado al usuario con id: {}", user.getId());
    }

    @Transactional
    public VerifyCodeResponseDto verifyResetCode(String email, String code) {
        User user = userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);
        String rawCode = code.replace(" ", "").replace("-", "").toUpperCase();

        PasswordResetCode resetCode = passwordResetCodeRepository.findFirstByUserAndUsedFalseOrderByCreatedAtDesc(user)
                .orElseThrow(InvalidResetCodeException::new);

        if (!resetCode.getCode().equals(rawCode)) {
            throw new InvalidResetCodeException();
        }

        if (resetCode.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new ExpiredResetCodeException();
        }

        resetCode.setUsed(true);
        passwordResetCodeRepository.save(resetCode);

        // Generar un token temporal para que el usuario pueda cambiar su contraseña en el siguiente paso
        String resetToken = jwtService.generatePasswordResetToken(user);
        return new VerifyCodeResponseDto("Identidad validada exitosamente", resetToken);
    }

    @Transactional
    public void resetPassword(com.navops.api.application.dto.request.ResetPasswordRequest request) {
        String username = jwtService.extractUsername(request.token());
        Boolean isResetToken = jwtService.extractClaim(request.token(), claims -> claims.get("reset", Boolean.class));

        if (Boolean.TRUE.equals(isResetToken)) {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(UserNotFoundException::new);

            user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
            userRepository.save(user);
            log.info("Contraseña restablecida exitosamente para {}", username);
        } else {
            throw new BadCredentialsException("Token inválido para esta operación");
        }
    }

    private String generateSecureCode(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        SecureRandom random = new SecureRandom();
        return random.ints(length, 0, chars.length())
                .mapToObj(i -> String.valueOf(chars.charAt(i)))
                .collect(Collectors.joining());
    }

    private String formatCode(String code) {
        if (code == null || code.length() != 8) return code;
        return code.substring(0, 4) + " - " + code.substring(4, 8);
    }
}
