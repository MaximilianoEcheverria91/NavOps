-- 1. Insertar Roles
INSERT INTO roles (id, name, description) VALUES
                                              ('11111111-1111-1111-1111-111111111111', 'ADMIN', 'Administrador Global'),
                                              ('11111111-1111-1111-1111-111111111112', 'CHIEF_NAVIGATION', 'Jefe de Navegación'),
                                              ('11111111-1111-1111-1111-111111111113', 'CHIEF_OPERATIONS', 'Jefe de Operaciones')
    ON CONFLICT (name) DO NOTHING;

-- 2. Insertar Países
INSERT INTO countries (id, country_name, iso_code, created_at, version)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Argentina', 'AR', CURRENT_TIMESTAMP, 1),
    ('22222222-2222-2222-2222-222222222222', 'Paraguay', 'PY', CURRENT_TIMESTAMP, 1),
    ('33333333-3333-3333-3333-333333333333', 'Uruguay', 'UY', CURRENT_TIMESTAMP, 1),
    ('44444444-4444-4444-4444-444444444444', 'Bolivia', 'BO', CURRENT_TIMESTAMP, 1),
    ('55555555-5555-5555-5555-555555555555', 'Chile', 'CL', CURRENT_TIMESTAMP, 1),
    ('66666666-6666-6666-6666-666666666666', 'Perú', 'PE', CURRENT_TIMESTAMP, 1),
    ('77777777-7777-7777-7777-777777777777', 'Colombia', 'CO', CURRENT_TIMESTAMP, 1),
    ('88888888-8888-8888-8888-888888888888', 'Venezuela', 'VE', CURRENT_TIMESTAMP, 1),
    ('99999999-9999-9999-9999-999999999999', 'Brazil', 'BR', CURRENT_TIMESTAMP, 1),
    ('10101010-1010-1010-1010-101010101010', 'Ecuador', 'EC', CURRENT_TIMESTAMP, 1)
    ON CONFLICT (iso_code) DO NOTHING;
