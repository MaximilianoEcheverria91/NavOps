package com.navops.api.infrastructure.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.navops.api.application.dto.request.VerifyCodeRequest;
import com.navops.api.application.dto.response.auth.VerifyCodeResponseDto;
import com.navops.api.application.service.AuthService;
import com.navops.api.infrastructure.exception.ExpiredResetCodeException;
import com.navops.api.infrastructure.exception.InvalidResetCodeException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class VerifyCodeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private com.navops.api.security.JwtService jwtService;

    @MockBean
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @MockBean
    private com.navops.api.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    @DisplayName("Should return 200 OK and JWT reset token when code is valid")
    void shouldReturn200WhenValidToken() throws Exception {
        VerifyCodeRequest request = new VerifyCodeRequest("test@navops.com", "ABCD1234");
        VerifyCodeResponseDto expectedResponse = new VerifyCodeResponseDto("Identidad validada exitosamente", "dummy-reset-token-ey123");

        when(authService.verifyResetCode(request.email(), request.code()))
                .thenReturn(expectedResponse);

        mockMvc.perform(post("/api/v1/auth/verify-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Identidad validada exitosamente"))
                .andExpect(jsonPath("$.resetToken").value("dummy-reset-token-ey123"));
    }

    @Test
    @DisplayName("Should return 400 Bad Request when code is invalid")
    void shouldReturn400WhenInvalidCode() throws Exception {
        VerifyCodeRequest request = new VerifyCodeRequest("test@navops.com", "INVALID0");

        when(authService.verifyResetCode(anyString(), anyString()))
                .thenThrow(new InvalidResetCodeException());

        mockMvc.perform(post("/api/v1/auth/verify-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("El código ingresado no es válido o ha expirado"));
    }

    @Test
    @DisplayName("Should return 400 Bad Request when code is expired")
    void shouldReturn400WhenExpiredCode() throws Exception {
        VerifyCodeRequest request = new VerifyCodeRequest("test@navops.com", "EXPIRED1");

        when(authService.verifyResetCode(anyString(), anyString()))
                .thenThrow(new ExpiredResetCodeException());

        mockMvc.perform(post("/api/v1/auth/verify-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("El código ingresado no es válido o ha expirado"));
    }

    @Test
    @DisplayName("Should return 400 Bad Request when request fields are invalid")
    void shouldReturn400WhenInvalidRequest() throws Exception {
        // Code is missing
        VerifyCodeRequest request = new VerifyCodeRequest("test@navops.com", null);

        mockMvc.perform(post("/api/v1/auth/verify-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
