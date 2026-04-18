package com.navops.api.infrastructure.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.navops.api.application.dto.request.LoginRequest;
import com.navops.api.application.dto.response.LoginResponseDto;
import com.navops.api.application.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;

import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // Ignore Spring Security filters for WebMvcTest, testing controller logic explicitly
class AuthControllerTest {

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

    @Test
    @DisplayName("Should return 200 OK and LoginResponse when credentials are valid")
    void shouldReturn200AndLoginResponseWhenValidRequest() throws Exception {
        LoginRequest validRequest = new LoginRequest("admin", "password123");
        LoginResponseDto expectedResponse = new LoginResponseDto(
                "mock.jwt.token",
                UUID.randomUUID(),
                "ROLE_ADMIN",
                "/dashboard"
        );

        when(authService.login(any(LoginRequest.class))).thenReturn(expectedResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock.jwt.token"))
                .andExpect(jsonPath("$.role").value("ROLE_ADMIN"))
                .andExpect(jsonPath("$.redirectUrl").value("/dashboard"));
    }

    @Test
    @DisplayName("Should return 400 Bad Request when request has empty fields")
    void shouldReturn400WhenRequestHasEmptyFields() throws Exception {
        // Missing username and short/empty password
        LoginRequest invalidRequest = new LoginRequest("", "");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 401 Unauthorized when credentials are invalid")
    void shouldReturn401WhenInvalidCredentials() throws Exception {
        LoginRequest invalidRequest = new LoginRequest("admin", "wrongpassword");

        when(authService.login(any(LoginRequest.class))).thenThrow(new BadCredentialsException("Invalid username or password"));

        // When testing with AutoConfigureMockMvc(addFilters = false), controller exceptions might 
        // fall through to the global exception handler. We ensure the handler or the controller handles it.
        // Assuming global exception handler maps BadCredentialsException to 401.
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isUnauthorized());
    }
}
