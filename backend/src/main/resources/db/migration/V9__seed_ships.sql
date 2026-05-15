
DO $$
DECLARE
country_ar_id UUID;
BEGIN
SELECT id INTO country_ar_id FROM countries WHERE iso_code = 'AR' LIMIT 1;

INSERT INTO ships (id, name, registration, imo_number, ship_type, length, beam, draft, depth, weight_tonnes, cargo_capacity_tonnes, crew_capacity, build_year, country_id, main_image_url, version, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'Libertador', '2-SE-2-158-97', '9176187', 'Mercantil', 41.56, 56.89, 56.45, 1.50, 8000, 900, 60, 1996, country_ar_id, null, 0, NOW(), NOW()),
    (gen_random_uuid(), 'San Martín', 'AR-001-2020', '9234512', 'Tanquero', 80.00, 14.00, 6.50, 8.00, 12000, 900, 50, 2005, country_ar_id, null, 0, NOW(), NOW()),
    (gen_random_uuid(), 'Patagonía', 'AR-002-2018', '9345678', 'Portacontenedor', 120.00, 20.00, 9.00, 12.00, 18000, 8000, 30, 2010, country_ar_id, null, 0, NOW(), NOW()),
    (gen_random_uuid(), 'Río de la Plata', 'AR-003-2015', '9456789', 'Granelero', 95.00, 16.00, 7.80, 10.00, 15000, 6500, 28, 2008, country_ar_id, null, 0, NOW(), NOW()),
    (gen_random_uuid(), 'Belgrano', 'AR-004-2019', '9567890', 'Remolcador', 35.00, 10.00, 4.20, 5.00, 3000, 500, 12, 2015, country_ar_id, null, 0, NOW(), NOW()),
    (gen_random_uuid(), 'Córdoba', 'AR-005-2021', '9678901', 'Mercantil', 60.00, 12.00, 5.50, 7.00, 9000, 3000, 20, 2018, country_ar_id, null, 0, NOW(), NOW()),
    (gen_random_uuid(), 'Atlantic Voyager', 'REG-AR-001', 'IMO9384756', 'Remolcador', 228.50, 32.20, 11.40, 18.70, 45200, 18500, 28, 2014, country_ar_id, null, 0, NOW(), NOW()),
    (gen_random_uuid(), 'Patagonia Queen', 'REG-BR-003', 'IMO9273645', 'Crucero', 310.80, 38.50, 8.90, 21.30, 78500, 12000, 145, 2019, country_ar_id, null, 0, NOW(), NOW()),
    (gen_random_uuid(), 'Rio Grande Carrier', 'AR-005-2041', 'IMO9456721', 'Granelero', 289.40, 44.10, 14.80, 24.60, 92300, 154000, 34, 2011, country_ar_id, null, 0, NOW(), NOW());

  RAISE NOTICE 'Ships seed completado: 6 barcos insertados.';
END $$;

