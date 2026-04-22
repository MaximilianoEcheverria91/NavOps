package com.navops.api.application.service;

import com.navops.api.application.dto.response.auth.VerifyCodeResponseDto;
import com.navops.api.domain.entity.PasswordResetCode;
import com.navops.api.domain.entity.User;
import com.navops.api.infrastructure.exception.ExpiredResetCodeException;
import com.navops.api.infrastructure.exception.InvalidResetCodeException;
import com.navops.api.repository.PasswordResetCodeRepository;
import com.navops.api.repository.UserRepository;
import com.navops.api.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetCodeRepository passwordResetCodeRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .email("test@navops.com")
                .build();
    }

    @Test
    @DisplayName("Should successfully send recovery email without logging the code")
    void shouldSuccessfullySendRecoveryEmailWithoutLoggingCode() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        authService.forgotPassword("test@navops.com");

        ArgumentCaptor<PasswordResetCode> codeCaptor = ArgumentCaptor.forClass(PasswordResetCode.class);
        verify(passwordResetCodeRepository).save(codeCaptor.capture());

        PasswordResetCode savedCode = codeCaptor.getValue();
        assertNotNull(savedCode);
        assertNotNull(savedCode.getCode());
        assertEquals(8, savedCode.getCode().length());

        ArgumentCaptor<String> emailCodeCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendPasswordRecoveryEmail(eq("test@navops.com"), emailCodeCaptor.capture());

        String emailFormattedCode = emailCodeCaptor.getValue();
        assertEquals(11, emailFormattedCode.length()); // e.g. "ABCD - 1234"
        assertTrue(emailFormattedCode.contains(" - "));
    }

    @Test
    @DisplayName("Should successfully verify valid code and set used to true")
    void shouldSuccessfullyVerifyCodeAndPreventReuse() {
        String rawCode = "ABCD1234";
        String spacedCode = "ABCD - 1234";

        PasswordResetCode validCode = PasswordResetCode.builder()
                .user(testUser)
                .code(rawCode)
                .expiresAt(OffsetDateTime.now().plusMinutes(5))
                .used(false)
                .build();

        when(userRepository.findByEmail("test@navops.com")).thenReturn(Optional.of(testUser));
        when(passwordResetCodeRepository.findFirstByUserAndUsedFalseOrderByCreatedAtDesc(testUser))
                .thenReturn(Optional.of(validCode));
        when(jwtService.generatePasswordResetToken(testUser)).thenReturn("reset-token");

        VerifyCodeResponseDto response = authService.verifyResetCode("test@navops.com", spacedCode);

        assertNotNull(response);
        assertEquals("reset-token", response.resetToken());
        assertEquals("Identidad validada exitosamente", response.message());

        ArgumentCaptor<PasswordResetCode> saveCaptor = ArgumentCaptor.forClass(PasswordResetCode.class);
        verify(passwordResetCodeRepository).save(saveCaptor.capture());
        assertTrue(saveCaptor.getValue().isUsed(), "El código debe marcarse como usado para evitar reutilización");
    }

    @Test
    @DisplayName("Should throw Exception when code is already used (prevent code reuse)")
    void shouldThrowExceptionWhenCodeReuse() {
        // Since findFirstByUserAndUsedFalseOrderByCreatedAtDesc requires used = false,
        // it means if all codes are used, it will return empty, resulting in Exception.
        when(userRepository.findByEmail("test@navops.com")).thenReturn(Optional.of(testUser));
        when(passwordResetCodeRepository.findFirstByUserAndUsedFalseOrderByCreatedAtDesc(testUser))
                .thenReturn(Optional.empty());

        assertThrows(InvalidResetCodeException.class, () -> {
            authService.verifyResetCode("test@navops.com", "ABCD1234");
        });
    }

    @Test
    @DisplayName("Should throw Exception when code is expired")
    void shouldThrowExceptionWhenCodeIsExpired() {
        PasswordResetCode expiredCode = PasswordResetCode.builder()
                .user(testUser)
                .code("ABCD1234")
                .expiresAt(OffsetDateTime.now().minusMinutes(1)) // Expired
                .used(false)
                .build();

        when(userRepository.findByEmail("test@navops.com")).thenReturn(Optional.of(testUser));
        when(passwordResetCodeRepository.findFirstByUserAndUsedFalseOrderByCreatedAtDesc(testUser))
                .thenReturn(Optional.of(expiredCode));

        assertThrows(ExpiredResetCodeException.class, () -> {
            authService.verifyResetCode("test@navops.com", "ABCD1234");
        });
    }
}
