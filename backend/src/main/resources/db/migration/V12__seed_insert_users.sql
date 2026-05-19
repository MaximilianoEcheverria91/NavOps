-- =============================================================================
-- SEED DE 10 USUARIOS + PEOPLE + CREW_MEMBERS (ARGENTINA - CABA)
-- =============================================================================

-- ==========================================================
-- 1. INSERCIÓN EN LA TABLA USERS
-- ==========================================================
INSERT INTO users (id, username, email, password_hash, is_active, is_blocked, role_id, version)
VALUES
    -- 2 de La Boca
    (gen_random_uuid(), 'santiago_lb', 'santiago.boca@navops.com', crypt('User123$', gen_salt('bf')), true, false, (SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1), 0),
    (gen_random_uuid(), 'marina_lb', 'marina.boca@navops.com', crypt('User123$', gen_salt('bf')), true, false, (SELECT id FROM roles WHERE name = 'CHIEF_NAVIGATION' LIMIT 1), 0),
    -- 2 de Barracas
    (gen_random_uuid(), 'lucas_ba', 'lucas.barracas@navops.com', crypt('User123$', gen_salt('bf')), true, false, (SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1), 0),
    (gen_random_uuid(), 'florencia_ba', 'florencia.barracas@navops.com', crypt('User123$', gen_salt('bf')), true, false, (SELECT id FROM roles WHERE name = 'CHIEF_NAVIGATION' LIMIT 1), 0),
    -- 2 de Belgrano (1 Admin corporativo)
    (gen_random_uuid(), 'andres_be', 'andres.belgrano@navops.com', crypt('User123$', gen_salt('bf')), true, false, (SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1), 0),
    (gen_random_uuid(), 'valeria_be', 'valeria.belgrano@navops.com', crypt('User123$', gen_salt('bf')), true, false, (SELECT id FROM roles WHERE name = 'CHIEF_NAVIGATION' LIMIT 1), 0),
    -- 2 de Boedo
    (gen_random_uuid(), 'matias_bo', 'matias.boedo@navops.com', crypt('User123$', gen_salt('bf')), true, false, (SELECT id FROM roles WHERE name = 'CHIEF_OPERATION' LIMIT 1), 0),
    (gen_random_uuid(), 'agustina_bo', 'agustina.boedo@navops.com', crypt('User123$', gen_salt('bf')), true, false, (SELECT id FROM roles WHERE name = 'CHIEF_OPERATION' LIMIT 1) , 0),
    -- 2 de Caballito (1 Admin corporativo)
    (gen_random_uuid(), 'nicolas_ca', 'nicolas.caballito@navops.com', crypt('User123$', gen_salt('bf')), true, false, (SELECT id FROM roles WHERE name = 'CHIEF_OPERATION' LIMIT 1), 0),
    (gen_random_uuid(), 'camila_ca', 'camila.caballito@navops.com', crypt('User123$', gen_salt('bf')), true, false, (SELECT id FROM roles WHERE name = 'CHIEF_NAVIGATION' LIMIT 1), 0)
    ON CONFLICT (email) DO NOTHING;

-- ==========================================================
-- 2. INSERCIÓN EN LA TABLA PEOPLE (Se vincula usando el Email de Users)
-- ==========================================================
INSERT INTO people (id, full_name, surname, document_type, document_number, cuil, nationality_country_id, marital_status, gender, birth_date, country_id, email, mobile, home_phone, address_street, address_number, address_floor, address_department, city_id, province_id, address_postal_code, status, avatar_url, user_id, version)
VALUES
    -- La Boca (Usa id de la boca: c9cb8d00-bc32-4923-8191-472abcc528cb)
    (gen_random_uuid(), 'Santiago', 'Lopez', 'DNI', '38555111', '20385551117', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'SINGLE', 'MALE', '1995-04-12', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'santiago.boca@navops.com', '+54 11 6111-1111', null, 'Necochea', '450', null, null, (SELECT id FROM cities WHERE name = 'La Boca' LIMIT 1), (SELECT id FROM provinces WHERE name = 'Ciudad Autónoma de Buenos Aires' LIMIT 1), '1158', 'ACTIVE', null, (SELECT id FROM users WHERE email = 'santiago.boca@navops.com'), 0),
    (gen_random_uuid(), 'Marina', 'Silva', 'DNI', '39111222', '27391112223', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'MARRIED', 'FEMALE', '1996-08-22', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'marina.boca@navops.com', '+54 11 6111-2222', null, 'Av. Almirante Brown', '820', '2', 'B', (SELECT id FROM cities WHERE name = 'La Boca' LIMIT 1), (SELECT id FROM provinces WHERE name = 'Ciudad Autónoma de Buenos Aires' LIMIT 1), '1159', 'ACTIVE', null, (SELECT id FROM users WHERE email = 'marina.boca@navops.com'), 0),

    -- Barracas (Usa id barracas: 22f382ca-7d08-4def-a803-cfb0f379338e)
    (gen_random_uuid(), 'Lucas', 'Fernandez', 'DNI', '37222333', '20372223337', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'DIVORCED', 'MALE', '1993-01-15', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'lucas.barracas@navops.com', '+54 11 6222-1111', null, 'Isabel La Católica', '125', null, null, (SELECT id FROM cities WHERE name = 'Barracas' LIMIT 1), (SELECT id FROM provinces WHERE name = 'Ciudad Autónoma de Buenos Aires' LIMIT 1), '1268', 'VACATION', null, (SELECT id FROM users WHERE email = 'lucas.barracas@navops.com'), 0),
    (gen_random_uuid(), 'Florencia', 'Gonzalez', 'PASSPORT', '95333444', '27953334443', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'COHABITANT', 'FEMALE', '1994-11-05', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'florencia.barracas@navops.com', '+54 11 6222-2222', null, 'Av. Montes de Oca', '1430', '10', 'C', (SELECT id FROM cities WHERE name = 'Barracas' LIMIT 1), (SELECT id FROM provinces WHERE name = 'Ciudad Autónoma de Buenos Aires'), '1270', 'ACTIVE', null, (SELECT id FROM users WHERE email = 'florencia.barracas@navops.com'), 0),

    -- Belgrano (Usa id belgrano: 4e688bab-d70f-4d41-96c4-c1fcf0b37f78)
    (gen_random_uuid(), 'Andrés', 'Rodriguez', 'DNI', '35444555', '20354445557', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'MARRIED', 'MALE', '1990-05-20', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'andres.belgrano@navops.com', '+54 11 6333-1111', null, 'Av. Cabildo', '2200', '14', 'A', (SELECT id FROM cities WHERE name = 'Belgrano' LIMIT 1), (SELECT id FROM provinces WHERE name = 'Ciudad Autónoma de Buenos Aires'), '1428', 'ACTIVE', null, (SELECT id FROM users WHERE email = 'andres.belgrano@navops.com'), 0),
    (gen_random_uuid(), 'Valeria', 'Benitez', 'DNI', '40555666', '27405556663', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'SINGLE', 'FEMALE', '1997-12-01', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'valeria.belgrano@navops.com', '+54 11 6333-2222', null, 'Echeverría', '1540', null, null, (SELECT id FROM cities WHERE name = 'Belgrano' LIMIT 1), (SELECT id FROM provinces WHERE name = 'Ciudad Autónoma de Buenos Aires'), '1430', 'MEDICAL_LEAVE', null, (SELECT id FROM users WHERE email = 'valeria.belgrano@navops.com'), 0),

    -- Boedo (Usa id boedo: a2781cb4-4660-410e-9cf3-664b546e12ab)
    (gen_random_uuid(), 'Matías', 'Alvarez', 'DNI', '36666777', '20366667777', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'SINGLE', 'MALE', '1992-07-14', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'matias.boedo@navops.com', '+54 11 6443-1111', null, 'Boedo', '740', null, null, (SELECT id FROM cities WHERE name = 'Boedo' LIMIT 1), (SELECT id FROM provinces WHERE name = 'Ciudad Autónoma de Buenos Aires'), '1218', 'ACTIVE', null, (SELECT id FROM users WHERE email = 'matias.boedo@navops.com'), 0),
    (gen_random_uuid(), 'Agustina', 'Castro', 'DNI', '39777888', '27397778883', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'MARRIED', 'FEMALE', '1996-03-30', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'agustina.boedo@navops.com', '+54 11 6443-2222', null, 'San Juan', '3500', '4', 'D', (SELECT id FROM cities WHERE name = 'Belgrano' LIMIT 1), (SELECT id FROM provinces WHERE name = 'Ciudad Autónoma de Buenos Aires'), '1220', 'ACTIVE', null, (SELECT id FROM users WHERE email = 'agustina.boedo@navops.com'), 0),

    -- Caballito (Usa id caballito: 4a59d319-926c-4cae-bcac-a35d0ba7567a)
    (gen_random_uuid(), 'Nicolás', 'Romero', 'DNI', '34888999', '20348889997', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'WIDOWED', 'MALE', '1989-10-25', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'nicolas.caballito@navops.com', '+54 11 6555-1111', null, 'Av. Rivadavia', '5100', '6', '12', (SELECT id FROM cities WHERE name = 'Caballito' LIMIT 1), (SELECT id FROM provinces WHERE name = 'Ciudad Autónoma de Buenos Aires'), '1405', 'SUSPENDED', null, (SELECT id FROM users WHERE email = 'nicolas.caballito@navops.com'), 0),
    (gen_random_uuid(), 'Camila', 'Herrera', 'DNI', '41999000', '27419990003', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'SINGLE', 'FEMALE', '1999-02-18', (SELECT id FROM countries WHERE iso_code = 'AR' LIMIT 1), 'camila.caballito@navops.com', '+54 11 6555-2222', null, 'Rosario', '620', null, null, (SELECT id FROM cities WHERE name = 'Caballito' LIMIT 1), (SELECT id FROM provinces WHERE name = 'Ciudad Autónoma de Buenos Aires'), '1406', 'ACTIVE', null, (SELECT id FROM users WHERE email = 'camila.caballito@navops.com'), 0)
    ON CONFLICT (user_id) DO NOTHING;

-- ==========================================================
-- 3. INSERCIÓN EN LA TABLA CREW_MEMBERS (Relación 1:1 con People)
-- ==========================================================
INSERT INTO crew_members (id, file_number, maritime_book_number, navigation_role, category, hire_date, current_status, version)
VALUES
    -- Tripulantes de La Boca
    ((SELECT id FROM people WHERE email = 'santiago.boca@navops.com'), 'LG00002', 'MB-AR-00002', 'CAPTAIN', 'SENIOR', '2020-03-01', 'AVAILABLE', 0),
    ((SELECT id FROM people WHERE email = 'marina.boca@navops.com'), 'LG00003', 'MB-AR-00003', 'FIRST_OFFICER', 'SENIOR', '2021-06-15', 'ON_BOARD', 0),

    -- Tripulantes de Barracas
    ((SELECT id FROM people WHERE email = 'lucas.barracas@navops.com'), 'LG00004', 'MB-AR-00004', 'CHIEF_ENGINEER', 'SENIOR', '2019-11-10', 'RESTING', 0),
    ((SELECT id FROM people WHERE email = 'florencia.barracas@navops.com'), 'LG00005', 'MB-AR-00005', 'SECOND_OFFICER', 'MID', '2022-01-20', 'ON_BOARD', 0),

    -- Tripulantes de Belgrano
    ((SELECT id FROM people WHERE email = 'andres.belgrano@navops.com'), 'LG00006', 'MB-AR-00006', 'ADMIN', 'SENIOR', '2018-05-10', 'AVAILABLE', 0), -- Admin
    ((SELECT id FROM people WHERE email = 'valeria.belgrano@navops.com'), 'LG00007', 'MB-AR-00007', 'THIRD_OFFICER', 'JUNIOR', '2023-09-01', 'MATERNITY_LEAVE', 0),

    -- Tripulantes de Boedo
    ((SELECT id FROM people WHERE email = 'matias.boedo@navops.com'), 'LG00008', 'MB-AR-00008', 'BOATSWAIN', 'MID', '2020-08-14', 'AVAILABLE', 0),
    ((SELECT id FROM people WHERE email = 'agustina.boedo@navops.com'), 'LG00009', 'MB-AR-00009', 'HELMSMAN', 'MID', '2021-02-28', 'ON_BOARD', 0),

    -- Tripulantes de Caballito
    ((SELECT id FROM people WHERE email = 'nicolas.caballito@navops.com'), 'LG00010', 'MB-AR-00010', 'ADMIN', 'SENIOR', '2017-04-12', 'UNAVAILABLE', 0), -- Admin
    ((SELECT id FROM people WHERE email = 'camila.caballito@navops.com'), 'LG00011', 'MB-AR-00011', 'COOK', 'JUNIOR', '2024-01-10', 'AVAILABLE', 0)
    ON CONFLICT (id) DO NOTHING;

-- 🚀 ESTA LÍNEA ES LA CLAVE:
-- Adelanta manualmente tu secuencia al número 12, para que cuando crees
-- un usuario en la UI, el sistema use el número 12 (LG00012) sin chocar con nadie.
SELECT setval('personnel_file_seq', 12, false);