-- ==========================================================
-- V6__seed_admin_user.sql
-- SEED USER + PEOPLE + CREW_MEMBER
-- ==========================================================

-- ==========================================================
-- 1. USER
-- ==========================================================

INSERT INTO users (
    username,
    email,
    password_hash,
    is_active,
    is_blocked,
    role_id,
    version
)
SELECT
    'admin',
    'ejemploprueba1112@gmail.com',
    crypt('Admin123$', gen_salt('bf')),
    true,
    false,
    r.id,
    0
FROM roles r
WHERE r.name = 'ADMIN'
    ON CONFLICT (email) DO NOTHING;

-- ==========================================================
-- 2. PEOPLE
-- ==========================================================

INSERT INTO people (
    full_name,
    surname,
    document_type,
    document_number,
    cuil,
    nationality_country_id,
    marital_status,
    gender,
    birth_date,
    country_id,
    email,
    mobile,
    home_phone,
    address_street,
    address_number,
    address_floor,
    address_department,
    city_id,
    province_id,
    address_postal_code,
    status,
    avatar_url,
    user_id,
    version
)
SELECT
    'Maximiliano',
    'Echeverria',
    'DNI',
    '40123456',
    '20401234567',
    n.id,
    'SINGLE',
    'MALE',
    DATE '1997-08-15',
    c.id,
    'ejemploprueba1112@gmail.com',
    '+54 11 5555-1111',
    '+54 11 4444-2222',
    'Av. Libertador',
    '1234',
    '5',
    'A',
    ci.id,
    p.id,
    '1001',
    'ACTIVE',
    NULL,
    u.id,
    0
FROM users u
         JOIN countries n
              ON n.iso_code = 'AR'
         JOIN countries c
              ON c.iso_code = 'AR'
         JOIN provinces p
              ON p.name = 'Buenos Aires'
         JOIN cities ci
              ON ci.name = 'La Plata'
WHERE u.email = 'ejemploprueba1112@gmail.com'
    ON CONFLICT (user_id) DO NOTHING;

-- ==========================================================
-- 3. CREW MEMBERS
-- ==========================================================

INSERT INTO crew_members (
    id,
    file_number,
    maritime_book_number,
    navigation_role,
    category,
    hire_date,
    current_status,
    version
)
SELECT
    pe.id,
    'LG00001',
    'MB-AR-00001',
    'ADMIN',
    'SENIOR',
    CURRENT_DATE,
    'AVAILABLE',
    0
FROM people pe
WHERE pe.email = 'ejemploprueba1112@gmail.com'
    ON CONFLICT (id) DO NOTHING;