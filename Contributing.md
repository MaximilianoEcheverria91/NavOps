Guía de Contribución - Proyecto NavOps

¡Bienvenidos al equipo de desarrollo! Para mantener la calidad de nuestro sistema de gestión marítima y aérea, todos los miembros deben seguir estas reglas de oro.
1. El Flujo de Trabajo (Git Flow)

Nadie trabaja directamente sobre las ramas principales. La estructura es:

    main: Solo código estable y probado (Producción).

    develop: Rama principal de integración. Todo el desarrollo nace y muere aquí.

    feature/área-nombre-tarea: Ramas temporales para nuevas funcionalidades.Ej:"feature/back-create-user"

Pasos para empezar una tarea:

    Sincronizar localmente: git checkout develop y git pull origin develop.

    Crear rama propia: git checkout -b feature/area-nombre-de-tu-tarea.

    Prohibido crear ramas con nombres personales (ej: feature/front-create-user).

2. Reglas de los Pull Requests (PR)

Para que tu código sea aceptado en develop:

    Revisión Obligatoria: Al menos 1 compañero debe revisar y aprobar el código (Approve).

    Status Checks: La GitHub Action debe estar en verde (el proyecto debe compilar y pasar tests).

    Sin Conflictos: Si la rama está desactualizada, debés hacer git merge develop en tu local y resolver conflictos antes de pedir la revisión.

3. Estándar de Commits

Usaremos Conventional Commits para que el historial sea legible:

    feat: Una nueva funcionalidad (ej: feat: validar código de seguridad).

    fix: Corrección de un error (ej: fix: error en el login de marinos).

    docs: Cambios solo en documentación (ej: docs: actualizar swagger).

    chore: Tareas de mantenimiento o configuración (ej: chore: agregar dependencias).

4. Estándar de Código y Seguridad

   Archivos Sensibles: Jamás subir archivos .env. Las credenciales se manejan localmente.

   Base de Datos: Si modificás la estructura de PostgreSQL, debés compartir el script SQL en la carpeta NavOps/backend/src/main/resources/db/migration

   Documentación: Toda nueva API debe estar anotada con Swagger para que el equipo de Frontend sepa cómo consumirla.

5. Definición de Hecho (Definition of Done)

Una tarea se considera terminada cuando:

    El código cumple con la funcionalidad solicitada en Jira.

    No hay errores de compilación en el backend (Java 21 / Spring Boot).

    El Pull Request fue aprobado y mergeado a develop.

    La rama temporal fue eliminada.

