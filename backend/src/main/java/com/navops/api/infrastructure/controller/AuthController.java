package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.request.ForgotPasswordRequest;
import com.navops.api.application.dto.request.LoginRequest;
import com.navops.api.application.dto.response.ErrorResponseDto;
import com.navops.api.application.dto.response.ForgotPasswordResponseDto;
import com.navops.api.application.dto.response.LoginResponseDto;
import com.navops.api.application.dto.request.VerifyCodeRequest;
import com.navops.api.application.dto.response.VerifyCodeResponseDto;
import com.navops.api.application.service.AuthService;
import com.navops.api.application.dto.request.ResetPasswordRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Gestión de sesiones, recuperación de contraseñas y seguridad")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Iniciar sesión", description = "Autentica al usuario y devuelve un JWT. El campo redirectUrl indica a qué dashboard debe ir según su rol.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Autenticación exitosa",
                    content = { @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponseDto.class)) }),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrectas (campos vacios)",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Credenciales inválidas",
                    content = @Content),
            @ApiResponse(responseCode = "423", description = "Cuenta bloqueada temporalmente)",
                    content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @Operation(summary = "Solicitar recuperación de contraseña", description = "Envía un código de 8 dígitos al email si el usuario existe. Por seguridad, siempre devuelve 200 para evitar enumeración de correos.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Returns success universally to prevent email enumeration.")
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponseDto> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
        return ResponseEntity.ok(new ForgotPasswordResponseDto("Se ha enviado un enlace a tu correo electrónico"));
    }

    @Operation(summary = "Verificar código de seguridad", description = "Valida el código del email. Si es correcto, devuelve un 'resetToken' temporal necesario para el siguiente paso.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Código válido",
                            content = { @Content(mediaType = "application/json", schema = @Schema(implementation = VerifyCodeResponseDto.class)) }),
                    @ApiResponse(responseCode = "400", description = "Código inválido o expirado",
                            content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
                    @ApiResponse(responseCode = "404", description = "Usuario no encontrado",
                            content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
            })
    @PostMapping("/verify-code")
    public ResponseEntity<VerifyCodeResponseDto> verifyCode(@Valid @RequestBody VerifyCodeRequest request) {
        return ResponseEntity.ok(authService.verifyResetCode(request.email(), request.code()));
    }

    @Operation(summary = "Restablecer contraseña", description = "Actualiza la contraseña usando el resetToken obtenido en la verificación.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Contraseña actualizada"),
                    @ApiResponse(responseCode = "400", description = "Token de restablecimiento inválido",
                            content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
            })
    @PostMapping("/reset-password")
    public ResponseEntity<ForgotPasswordResponseDto> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(new ForgotPasswordResponseDto("Tu contraseña fue actualizada con éxito"));
    }
}
