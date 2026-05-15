-- ==========================================================
-- 1. ROLES
-- ==========================================================

INSERT INTO roles (id, name, description, version, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'ADMIN', 'Administrador del sistema con acceso completo', 0, NOW(), NOW()),
    (gen_random_uuid(), 'CHIEF_NAVIGATION', 'Responsable de la navegación y las operaciones marítimas.', 0, NOW(), NOW()),
    (gen_random_uuid(), 'CHIEF_OPERATION', 'Responsable de la logística operativa y la gestión de carga.', 0, NOW(), NOW());







