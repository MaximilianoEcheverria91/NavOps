DO $$
DECLARE
  country_ar_id UUID;
BEGIN
  SELECT id INTO country_ar_id FROM countries WHERE iso_code = 'AR' LIMIT 1;

  INSERT INTO ships (name, registration, imo_number, ship_type,
                     length, beam, draft, depth,
                     weight_tonnes, cargo_capacity_tonnes, crew_capacity,
                     build_year, country_id, main_image_url)
  VALUES
    ('Libertador',     '2-SE-2-158-97',  '9176187', 'Mercantil',
     41.56, 56.89, 56.45, 1.50, 8000, 900, 60, 1996, country_ar_id, null),

    ('San Martín',     'AR-001-2020',    '9234512', 'Tanquero',
     80.00, 14.00, 6.50, 8.00, 12000, 5000, 25, 2005, country_ar_id, null),

    ('Patagonia',      'AR-002-2018',    '9345678', 'Portacontenedor',
     120.00, 20.00, 9.00, 12.00, 18000, 8000, 30, 2010, country_ar_id, null),

    ('Río de la Plata','AR-003-2015',    '9456789', 'Granelero',
     95.00, 16.00, 7.80, 10.00, 15000, 6500, 28, 2008, country_ar_id, null),

    ('Belgrano',       'AR-004-2019',    '9567890', 'Remolcador',
     35.00, 10.00, 4.20, 5.00, 3000, 500, 12, 2015, country_ar_id, null),

    ('Córdoba',        'AR-005-2021',    '9678901', 'Mercantil',
     60.00, 12.00, 5.50, 7.00, 9000, 3000, 20, 2018, country_ar_id, null);

  RAISE NOTICE 'Ships seed completado: 6 barcos insertados.';
END $$;