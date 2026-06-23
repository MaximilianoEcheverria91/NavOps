package com.navops.api.application.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender javaMailSender;

    @Mock
    private TemplateEngine templateEngine;

    @InjectMocks
    private EmailService emailService;

    @Test
    @DisplayName("Should successfully configure the email sending with Thymeleaf context")
    void shouldSuccessfullySendEmail() throws MessagingException {
        ReflectionTestUtils.setField(emailService, "fromEmail", "soporte@navops.com");

        MimeMessage mimeMessageMock = mock(MimeMessage.class);
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessageMock);

        // 🔥 CORREGIDO: Cambiamos "password-recovery.html" por "password-recovery"
        when(templateEngine.process(eq("password-recovery"), any(Context.class))).thenAnswer(invocation -> {
            Context context = invocation.getArgument(1, Context.class);
            assertEquals("test@navops.com", context.getVariable("email"));
            assertEquals("ABCD - 1234", context.getVariable("code"));
            return "<html><body>Contenido Simulado</body></html>";
        });

        emailService.sendPasswordRecoveryEmail("test@navops.com", "ABCD - 1234");

        verify(javaMailSender).send(mimeMessageMock);
        // 🔥 CORREGIDO ACÁ TAMBIÉN PARA LA VERIFICACIÓN
        verify(templateEngine).process(eq("password-recovery"), any(Context.class));
    }
};