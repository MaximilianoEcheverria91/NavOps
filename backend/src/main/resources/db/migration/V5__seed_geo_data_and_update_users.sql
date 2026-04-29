DO $$
DECLARE
country_ar_id UUID;
    prov_ba_id UUID;
    prov_sf_id UUID;
    prov_cba_id UUID;
    city_lomas_id UUID;
BEGIN
    -- 1. Obtener ID de Argentina
SELECT id INTO country_ar_id FROM countries WHERE iso_code = 'AR' LIMIT 1;

-- 2. Insertar Provincias (Agregado ON CONFLICT)
INSERT INTO provinces (name, country_id) VALUES
                                             ('Buenos Aires', country_ar_id),
                                             ('Santa Fe', country_ar_id),
                                             ('Córdoba', country_ar_id)
    ON CONFLICT (name) DO NOTHING; -- <--- ESTO EVITA EL ERROR

SELECT id INTO prov_ba_id FROM provinces WHERE name = 'Buenos Aires';
SELECT id INTO prov_sf_id FROM provinces WHERE name = 'Santa Fe';
SELECT id INTO prov_cba_id FROM provinces WHERE name = 'Córdoba';

-- 3. Insertar Ciudades (Agregado ON CONFLICT)
INSERT INTO cities (name, province_id) VALUES
                                           ('Lomas de Zamora', prov_ba_id),
                                           ('Lanús', prov_ba_id),
                                           ('Rosario', prov_sf_id),
                                           ('Córdoba Capital', prov_cba_id)
    ON CONFLICT (name, province_id) DO NOTHING; -- <--- ESTO EVITA EL ERROR

SELECT id INTO city_lomas_id FROM cities WHERE name = 'Lomas de Zamora' AND province_id = prov_ba_id;

-- 4. Actualizar a los usuarios Maxi y Fer
UPDATE people
SET
    province_id = prov_ba_id,
    city_id = city_lomas_id,
    status = 'ACTIVE',
    nationality_country_id = country_ar_id
WHERE document_number IN ('36397576', '35569789');

-- 5. Actualizar estados operativos
UPDATE crew_members SET current_status = 'AVAILABLE';
UPDATE users SET is_blocked = false;

RAISE NOTICE 'Sincronización de geografía y estados completada.';
END $$;