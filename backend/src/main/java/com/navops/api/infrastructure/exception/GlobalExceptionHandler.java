package com.navops.api.infrastructure.exception;

import com.navops.api.application.dto.response.ErrorResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ErrorResponseDto response = new ErrorResponseDto(
                "Bad Request",
                message.isEmpty() ? "Complete todos los campos" : message,
                HttpStatus.BAD_REQUEST.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDto> handleBadCredentials(BadCredentialsException ex) {
        ErrorResponseDto response = new ErrorResponseDto(
                "Unauthorized",
                "Usuario o contraseña incorrectos",
                HttpStatus.UNAUTHORIZED.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ErrorResponseDto> handleLockedException(LockedException ex) {
        ErrorResponseDto response = new ErrorResponseDto(
                "Locked",
                ex.getMessage(),
                HttpStatus.LOCKED.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.LOCKED).body(response);
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDto> handleResourceAlreadyExists(ResourceAlreadyExistsException ex) {
        ErrorResponseDto response = new ErrorResponseDto(
                "Conflict",
                ex.getMessage(),
                HttpStatus.CONFLICT.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDto> handleHttpMessageNotReadable(org.springframework.http.converter.HttpMessageNotReadableException ex) {
        log.error("Error al leer el mensaje HTTP: ", ex);
        ErrorResponseDto response = new ErrorResponseDto(
                "Bad Request",
                "El formato del JSON enviado es incorrecto o contiene datos incompatibles.",
                HttpStatus.BAD_REQUEST.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponseDto> handleTypeMismatch(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException ex) {
        log.error("Error de tipo en argumento: ", ex);
        ErrorResponseDto response = new ErrorResponseDto(
                "Bad Request",
                "El parámetro '" + ex.getName() + "' tiene un formato inválido.",
                HttpStatus.BAD_REQUEST.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(org.springframework.web.multipart.support.MissingServletRequestPartException.class)
    public ResponseEntity<ErrorResponseDto> handleMissingPart(org.springframework.web.multipart.support.MissingServletRequestPartException ex) {
        log.error("Falta parte en la petición multipart: ", ex);
        ErrorResponseDto response = new ErrorResponseDto(
                "Bad Request",
                "Falta el campo requerido en la petición: " + ex.getRequestPartName(),
                HttpStatus.BAD_REQUEST.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGenericException(Exception ex) {
        log.error("Error inesperado en el servidor: ", ex);
        ErrorResponseDto response = new ErrorResponseDto(
                "Internal Server Error",
                "Ha ocurrido un error inesperado: " + ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler({InvalidResetCodeException.class, ExpiredResetCodeException.class})
    public ResponseEntity<ErrorResponseDto> handleInvalidOrExpiredCode(RuntimeException ex) {
        ErrorResponseDto response = new ErrorResponseDto(
                "Bad Request",
                "El código ingresado no es válido o ha expirado",
                HttpStatus.BAD_REQUEST.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponseDto response = new ErrorResponseDto(
                "Not Found",
                ex.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(EmailNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleEmailNotFound(EmailNotFoundException ex) {
        ErrorResponseDto response = new ErrorResponseDto(
                "Not Found",
                ex.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(org.springframework.dao.InvalidDataAccessApiUsageException.class)
    public ResponseEntity<ErrorResponseDto> handleInvalidDataAccess(org.springframework.dao.InvalidDataAccessApiUsageException ex) {
        log.error("Error de integridad de datos: ", ex);
        ErrorResponseDto response = new ErrorResponseDto(
                "Petición Inválida",
                "Faltan IDs requeridos o hay un error de formato en las relaciones (País, Rol, etc.)",
                HttpStatus.BAD_REQUEST.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(NoCountriesFoundException.class) // Tendrías que crear esta clase
    public ResponseEntity<ErrorResponseDto> handleNoCountries(NoCountriesFoundException ex) {
        ErrorResponseDto response = new ErrorResponseDto(
                "Sin Contenido",
                ex.getMessage(),
                HttpStatus.NO_CONTENT.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }

    @ExceptionHandler(NoRoleFoundException.class) // Tendrías que crear esta clase
    public ResponseEntity<ErrorResponseDto> NoRoleFoundException(NoRoleFoundException ex) {
        ErrorResponseDto response = new ErrorResponseDto(
                "Sin Contenido",
                ex.getMessage(),
                HttpStatus.NO_CONTENT.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }

    @ExceptionHandler(NoPersonnelFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleNoPersonnelFound(NoPersonnelFoundException ex) {
        ErrorResponseDto response = new ErrorResponseDto(
                "Not Found",
                ex.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(NoProvincesFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleNoProvincesFound(NoProvincesFoundException ex) {
        ErrorResponseDto response = new ErrorResponseDto(
                "Sin Contenido",
                ex.getMessage(),
                HttpStatus.NO_CONTENT.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }

    @ExceptionHandler(NoCitiesFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleNoCitiesFound(NoCitiesFoundException ex) {
        ErrorResponseDto response = new ErrorResponseDto(
                "Sin Contenido",
                ex.getMessage(),
                HttpStatus.NO_CONTENT.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }

    @ExceptionHandler(PortAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDto> handlePortAlreadyExists(PortAlreadyExistsException ex) {
        ErrorResponseDto response = new ErrorResponseDto(
                "Conflict",
                ex.getMessage(),
                HttpStatus.CONFLICT.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(PortNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handlePortNotFound(PortNotFoundException ex) {
        ErrorResponseDto response = new ErrorResponseDto(
                "Not Found",
                ex.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(NoPortsFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleNoPortsFound(NoPortsFoundException ex) {
        ErrorResponseDto response = new ErrorResponseDto(
                "Sin Contenido",
                ex.getMessage(),
                HttpStatus.NO_CONTENT.value(),
                OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }

}