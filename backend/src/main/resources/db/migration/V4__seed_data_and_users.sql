DO $$
DECLARE
role_admin_id UUID;
    role_nav_id UUID;
    country_id UUID;
    user1_id UUID;
    user2_id UUID;
    person1_id UUID;
    person2_id UUID;
    prov_ba_id UUID;
    city_lomas_id UUID;
BEGIN
    -- 1. Buscamos IDs base
SELECT id INTO role_admin_id FROM roles WHERE name = 'ADMIN';
SELECT id INTO role_nav_id FROM roles WHERE name = 'CHIEF_NAVIGATION';
SELECT id INTO country_id FROM countries WHERE iso_code = 'AR' LIMIT 1;

-- 2. Insertamos Geografía de prueba
INSERT INTO provinces (name, country_id) VALUES ('Buenos Aires', country_id);
SELECT id INTO prov_ba_id FROM provinces WHERE name = 'Buenos Aires';

INSERT INTO cities (name, province_id) VALUES ('Lomas de Zamora', prov_ba_id), ('Lanús', prov_ba_id);
SELECT id INTO city_lomas_id FROM cities WHERE name = 'Lomas de Zamora';

-- 3. Insertar Usuarios
INSERT INTO users (username, email, password_hash, role_id)
VALUES
    ('admin', 'ejemploprueba1112@gmail.com', '$2a$10$8v86K.IqR.uB.6uV9v.7O.XvW9A6S1Z7m8n5G5T3X9.6G5T3X9', role_admin_id),
    ('nav', 'fer@navops.com', '$2a$10$8v86K.IqR.uB.6uV9v.7O.XvW9A6S1Z7m8n5G5T3X9.6G5T3X9', role_nav_id);

SELECT id INTO user1_id FROM users WHERE username = 'admin';
SELECT id INTO user2_id FROM users WHERE username = 'nav';

-- 4. Insertar People (YA NORMALIZADO: Sin columna nationality string, con province_id y city_id)
INSERT INTO people (full_name, surname, document_type, document_number, cuil, marital_status, gender, birth_date, country_id, email, user_id, province_id, city_id, nationality_country_id, status)
VALUES
    ('Maximiliano', 'Echeverria', 'DNI', '36397576', '20363975764', 'SINGLE', 'MALE', '1994-05-15', country_id, 'ejemploprueba1112@gmail.com', user1_id, prov_ba_id, city_lomas_id, country_id, 'ACTIVE'),
    ('Fernando', 'Echeverria', 'DNI', '35569789', '20355697894', 'MARRIED', 'MALE', '1991-09-05', country_id, 'fer@navops.com', user2_id, prov_ba_id, city_lomas_id, country_id, 'ACTIVE');

SELECT id INTO person1_id FROM people WHERE document_number = '36397576';
SELECT id INTO person2_id FROM people WHERE document_number = '35569789';

-- 5. Insertar Crew Members
INSERT INTO crew_members (id, file_number, maritime_book_number, navigation_role, category, hire_date, current_status)
VALUES
    (person1_id, 'LG00001', 'MAT-1234-A', 'Capitán', 'Senior', '2020-01-10', 'AVAILABLE'),
    (person2_id, 'LG00002', 'MAT-5678-B', 'Oficial de Cubierta', 'Junior', '2022-03-15', 'AVAILABLE');

RAISE NOTICE 'Carga completa exitosa con estructura 3FN.';
END $$;