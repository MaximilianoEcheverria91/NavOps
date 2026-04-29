package com.navops.api.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Builder;

import java.time.LocalDate;
import java.util.UUID;

@Schema(description = "Registro de usuarios")
public record PersonnelRegistrationRequest(

        @NotNull(message = "La información general es obligatoria")
        GeneralInfo generalInfo,

        @NotNull(message = "La información de residencia es obligatoria")
        ResidenceInfo residenceInfo,

        @NotNull(message = "La información de contacto es obligatoria")
        ContactInfo contactInfo,

        @NotNull(message = "Los datos laborales son obligatorios")
        LaborData laborData,

        SystemAccessData systemAccessData
) {
    @Builder
    public record GeneralInfo(

            @Schema(example = "Maximiliano", requiredMode = Schema.RequiredMode.REQUIRED, description = "Nombre de la persona" )
            @NotBlank(message = "El nombre es obligatorio")
            String name,

            @Schema(example = "Echeverria", requiredMode = Schema.RequiredMode.REQUIRED, description = "Apellido de la persona" )
            @NotBlank(message = "El apellido es obligatorio")
            String surname,

            @Schema(example = "DNI", requiredMode = Schema.RequiredMode.REQUIRED, description = "Tipo de documento de la persona" )
            @NotBlank(message = "El tipo de documento es obligatorio")
            String documentType,

            @Schema(example = "38235489", requiredMode = Schema.RequiredMode.REQUIRED, description = "Número de documento de la persona" )
            @NotBlank(message = "El número de documento es obligatorio")
            String documentNumber,

            @Schema(example = "20382354894", requiredMode = Schema.RequiredMode.REQUIRED, description = "Número de CUIL de la persona" )
            @NotBlank(message = "El número de CUIL es obligatorio")
            String cuil,

            @Schema(example = "1985-05-15", requiredMode = Schema.RequiredMode.REQUIRED, description = "Fecha de nacimiento de la persona" )
            @NotNull(message = "La fecha de nacimiento es obligatoria")
            @Past(message = "La fecha de nacimiento debe ser en el pasado")
            LocalDate birthDate,

            @Schema(example = "Argentina", requiredMode = Schema.RequiredMode.REQUIRED, description = "Nacionalidad de la persona" )
            @NotNull(message = "La nacionalidad es obligatoria")
            String nationality,

            @Schema(example = "Soltero", requiredMode = Schema.RequiredMode.REQUIRED, description = "Estao civil de la persona" )
            @NotNull(message = "El estado civil es obligatorio")
            String maritalStatus,

            @Schema(example = "Argentina", requiredMode = Schema.RequiredMode.REQUIRED, description = "Nacionalidad de la persona" )
            @NotNull(message = "La nacionalidad es obligatoria")
            UUID nationalityCountryId, //

            @Schema(example = "Masculino", requiredMode = Schema.RequiredMode.REQUIRED, description = "Genero de la persona" )
            @NotBlank(message = "El género es obligatorio")
            String gender
    ) {}

    @Builder
    public record ResidenceInfo(
            @Schema(example = "e1234567-e123-e123-e123-e12345678901", requiredMode = Schema.RequiredMode.REQUIRED, description = "ID de País" )
            @NotNull(message = "El ID del país es obligatorio")
            UUID countryId,

            @NotNull(message = "El ID de la provincia es obligatorio")
            @NotNull(message = "El ID de la provincia debe ser obligatorio")
            UUID provinceId,

            @NotNull(message = "El ID de la ciudad es obligatorio")
            @NotNull(message = "El ID de la ciudad debe ser obligatorio")
            UUID cityId,

            @Schema(example = "1832", requiredMode = Schema.RequiredMode.REQUIRED, description = "Código postal del usuario" )
            @NotBlank(message = "El código postal es obligatorio")
            String PostalCode,

            @Schema(example = "San Vicente", requiredMode = Schema.RequiredMode.REQUIRED, description = "Nombre de la calle donde reside la persona" )
            @NotBlank(message = "El nombre de la calle es obligatoria")
            String street,

            @Schema(example = "1464", requiredMode = Schema.RequiredMode.REQUIRED, description = "Número o altura de la calle donde reside la persona" )
            @NotBlank(message = "El número o la altura de la calle es obligatoria")
            String number,

            @Schema(example = "B2", requiredMode = Schema.RequiredMode.REQUIRED, description = "Departamento donde reside la persona" )
            String department,

            @Schema(example = "12", requiredMode = Schema.RequiredMode.REQUIRED, description = "Número de piso del departamento donde reside la persona" )
            String floor
    ) {}

    @Builder
    public record ContactInfo(
            @Schema(example = "42853252", requiredMode = Schema.RequiredMode.REQUIRED, description = "Número del teléfono fijo de la persona" )
            String particularPhone,

            @Schema(example = "1157642102", requiredMode = Schema.RequiredMode.REQUIRED, description = "Número del celular de la persona" )
            String cellPhone,

            @Schema(example = "ejemplo@gmail.com", requiredMode = Schema.RequiredMode.REQUIRED, description = "Correo electrónico de la persona" )
            @NotBlank(message = "El email es obligatorio")
            @Email(message = "Formato de correo electrónico inválido")
            String email
    ) {}

    @Builder
    public record LaborData(
            @Schema(example = "Operario carga", requiredMode = Schema.RequiredMode.REQUIRED, description = "Rol de la persona dentro de la embarcación" )
            @NotBlank(message = "El rol de navegación es obligatorio")
            String navigationRole,

            @Schema(example = "Auxiliar", requiredMode = Schema.RequiredMode.REQUIRED, description = "Categoria de la persona" )
            @NotBlank(message = "La categoría es obligatoria")
            String category,

            @Schema(example = "2020-01-10", requiredMode = Schema.RequiredMode.REQUIRED, description = "Fecha de ingreso de la persona a la empresa" )
            @NotNull(message = "La fecha de ingreso es obligatoria")
            LocalDate hireDate,

            @Schema(example = "MAT-7777-C", requiredMode = Schema.RequiredMode.REQUIRED, description = "Número de libreta marítima única de la persona" )
            @NotBlank(message = "El número de libreta marítima es obligatorio")
            String maritimeBookNumber,

            @Schema(example = "Activo", requiredMode = Schema.RequiredMode.REQUIRED, description = "Estado de la persona" )
            @NotBlank(message = "El estado es obligatorio")
            String status
    ) {}

    @Builder
    public record SystemAccessData(
            @Schema(example = "true", requiredMode = Schema.RequiredMode.REQUIRED, description = "True o false si la persona tiene acceso al sistema" )
            boolean belongsToSystem,

            @Schema(example = "Admin", requiredMode = Schema.RequiredMode.REQUIRED, description = "Nombre del usuario de la persona para el acceso al sistema NavOps" )
            @NotBlank(message = "El nombre de usuario es obligatorio")
            String username,

            @Schema(example = "Admin123$", requiredMode = Schema.RequiredMode.REQUIRED, description = "Contraseña del usuario para el ingreso al sistema NavOps")
            @NotBlank(message = "La contraseña es obligatoria")
            @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&._-])[A-Za-z\\d@$!%*?&._-]{8,}$",
                    message = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial")
            String password,

            @Schema(example = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", requiredMode = Schema.RequiredMode.REQUIRED, description = "ID de Rol de la persona")
            @NotBlank(message = "La contraseña es obligatoria")
            UUID roleId
    ) {}
}
