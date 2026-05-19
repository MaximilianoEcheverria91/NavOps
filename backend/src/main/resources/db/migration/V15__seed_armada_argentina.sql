DO $$
DECLARE
  country_ar_id UUID;
  base_url TEXT := 'https://www.argentina.gob.ar/sites/default/files/';

BEGIN
  SELECT id INTO country_ar_id FROM countries WHERE iso_code = 'AR' LIMIT 1;

  -- Eliminar los 6 barcos ficticios del seed V8
  DELETE FROM ships WHERE imo_number IN (
    '9176187', '9234512', '9345678', '9456789', '9567890', '9678901', 'IMO9384756','IMO9273645','IMO9456721'
  );

  -- Insertar 18 barcos reales de la Armada Argentina
  -- depth estimado como calado × 1.6
  -- weight_tonnes = desplazamiento a plena carga
  -- cargo_capacity_tonnes = 0 para buques de guerra
  -- imo_number = ficticio formato AR-[pennant sin guion]-[año]
  -- hull_number = pennant
  INSERT INTO ships ( id, name, registration, imo_number, hull_number, ship_type,
                     length, beam, draft, depth,
                     weight_tonnes, cargo_capacity_tonnes, crew_capacity,
                     build_year, country_id, main_image_url, is_active, version, created_at, updated_at)
  VALUES
    -- Destructores MEKO 360
    (gen_random_uuid(),'ARA Almirante Brown', 'D-10', 'AR-D10-1983', 'D-10', 'Destructor MEKO 360',
     125.9, 14.0, 5.8,  9.28, 3600, 0, 200, 1983, country_ar_id,
     base_url || 'destructor_ara_almirante_brown.jpg', true, 0, NOW(), NOW()),

    (gen_random_uuid(),'ARA La Argentina','D-11', 'AR-D11-1983', 'D-11', 'Destructor MEKO 360',
     125.9, 14.0, 5.8, 9.28, 3600, 0, 200, 1983, country_ar_id,
     base_url || 'destructor_ara_la_argentina.jpg',true, 0, NOW(), NOW()),

    (gen_random_uuid(),'ARA Sarandí','D-13', 'AR-D13-1984', 'D-13', 'Destructor MEKO 360',
     125.9, 14.0, 5.8,  9.28, 3600, 0, 200, 1984, country_ar_id,
     base_url || 'destructor_ara_sarandi.jpg', true, 0, NOW(), NOW()),

    -- Corbetas MEKO 140
    (gen_random_uuid(),'ARA Espora','P-41', 'AR-P41-1985', 'P-41', 'Corbeta MEKO 140',
     91.2, 11.1, 4.5,  7.20, 1790,0, 100, 1985, country_ar_id,
     base_url || 'corbeta-ara-espora.jpg',true, 0, NOW(), NOW()),

    (gen_random_uuid(),'ARA Rosales','P-42', 'AR-P42-1986', 'P-42', 'Corbeta MEKO 140',
     91.2, 11.1, 4.5,  7.20, 1790,0, 100, 1986, country_ar_id,
     base_url || 'corbeta_ara_rosales.jpg',true, 0, NOW(), NOW()),

    (gen_random_uuid(),'ARA Spiro','P-43', 'AR-P43-1988', 'P-43', 'Corbeta MEKO 140',
     91.2, 11.1, 4.5,  7.20, 1790,    0, 100, 1988, country_ar_id,
     base_url || 'corbeta_ara_spiro_0.jpg',true, 0, NOW(), NOW()),

    (gen_random_uuid(),'ARA Parker','P-44', 'AR-P44-1990', 'P-44', 'Corbeta MEKO 140',
     91.2, 11.1, 4.5,  7.20, 1790,    0, 100, 1990, country_ar_id,
     base_url || 'araparker.jpg',true, 0, NOW(), NOW()),

    (gen_random_uuid(), 'ARA Robinson','P-45', 'AR-P45-2003', 'P-45', 'Corbeta MEKO 140',
     91.2, 11.1, 4.5,  7.20, 1790,    0, 100, 2003, country_ar_id,
     base_url || 'corbeta_ara_robinson_0.jpg', true, 0, NOW(), NOW()),

    (gen_random_uuid(),'ARA Gómez Roca','P-46', 'AR-P46-2005', 'P-46', 'Corbeta MEKO 140',
     91.2, 11.1, 4.5,  7.20, 1790,    0, 100, 2005, country_ar_id,
     base_url || 'corbeta_ara_gomez_roca_0.jpg',true, 0, NOW(), NOW()),

    -- Patrullero
    (gen_random_uuid(),'ARA King','P-21', 'AR-P21-1946', 'P-21', 'Patrullero',
     77.0,  9.0, 4.0,  6.40,  875,    0, 130, 1946, country_ar_id,
     base_url || 'patrullero_ara_king_imagen.jpg',true, 0, NOW(), NOW()),

    -- Patrulleros Oceánicos OPV
    (gen_random_uuid(),'ARA Bouchard','P-51', 'AR-P51-2020', 'P-51', 'Patrullero Oceánico OPV',
     87.0, 13.6, 3.8,  6.08, 1930,    0,  39, 2020, country_ar_id,
     base_url || 'ara_bouchard_en_alta_mar.jpeg',true, 0, NOW(), NOW()),

    (gen_random_uuid(),'ARA Piedrabuena','P-52', 'AR-P52-2021', 'P-52', 'Patrullero Oceánico OPV',
     87.0, 13.6, 4.2,  6.72, 1930,    0,  40, 2021, country_ar_id,
     base_url || 'arapiedrabuena.jpg',true, 0, NOW(), NOW()),

    (gen_random_uuid(),'ARA Storni','P-53', 'AR-P53-2021', 'P-53', 'Patrullero Oceánico OPV',
     87.0, 13.6, 4.2,  6.72, 1930,    0,  40, 2021, country_ar_id,
     base_url || '0412_arriboarastorni_00-1024x612_1.jpg',true, 0, NOW(), NOW()),

    (gen_random_uuid(),'ARA Contraalmirante Cordero',   'P-54', 'AR-P54-2022', 'P-54', 'Patrullero Oceánico OPV',
     87.0, 13.6, 4.2,  6.72, 1930,0,40,2022,country_ar_id,
     base_url || 'p-54.jpg',true, 0, NOW(), NOW()),

    -- Buque Escuela
    (gen_random_uuid(),'Fragata ARA Libertad','Q-2',  'AR-Q2-1963',  'Q-2',  'Buque Escuela',
     91.7, 14.3, 6.6, 10.56, 2587, 0, 350, 1963, country_ar_id,
     base_url || 'fragara_ara_libertad.jpg',true, 0, NOW(), NOW()),

    -- Rompehielos
    (gen_random_uuid(),'ARA Almirante Irízar','Q-5',  'AR-Q5-1977',  'Q-5',  'Rompehielos',
     121.3, 25.2, 9.5, 15.20, 14900, 3000, 312, 1977, country_ar_id,
     base_url || 'rompehielos_ara_almirante_irizar.jpg',true, 0, NOW(), NOW()),

    -- Avisos
    (gen_random_uuid(),'ARA Puerto Argentino','A-21', 'AR-A21-1989', 'A-21', 'Aviso',
     81.4, 16.3, 5.2,  8.32, 2100,  500,  30, 1989, country_ar_id,
     base_url || 'aviso_puerto_argentino.jpg',true, 0, NOW(), NOW()),

    (gen_random_uuid(),'ARA Islas Malvinas','A-24', 'AR-A24-1987', 'A-24', 'Aviso',
     81.4, 16.3, 5.2,  8.32, 2100,  500,  30, 1987, country_ar_id,
     base_url || 'aviso_islas_malvinas.jpg',true, 0, NOW(), NOW());

  RAISE NOTICE 'V12 seed completado: 6 barcos ficticios eliminados, 18 barcos reales de la Armada Argentina insertados.';
END $$;
