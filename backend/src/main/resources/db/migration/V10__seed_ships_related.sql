-- backend/src/main/resources/db/migration/V10__seed_ships_related.sql
DO $$
DECLARE
  ship_libertador    UUID;
  ship_san_martin    UUID;
  ship_patagonia     UUID;
  ship_riodelaplata  UUID;
  ship_belgrano      UUID;
  ship_cordoba       UUID;
BEGIN
  SELECT id INTO ship_libertador   FROM ships WHERE registration = '2-SE-2-158-97' LIMIT 1;
  SELECT id INTO ship_san_martin   FROM ships WHERE registration = 'AR-001-2020'   LIMIT 1;
  SELECT id INTO ship_patagonia    FROM ships WHERE registration = 'AR-002-2018'   LIMIT 1;
  SELECT id INTO ship_riodelaplata FROM ships WHERE registration = 'AR-003-2015'   LIMIT 1;
  SELECT id INTO ship_belgrano     FROM ships WHERE registration = 'AR-004-2019'   LIMIT 1;
  SELECT id INTO ship_cordoba      FROM ships WHERE registration = 'AR-005-2021'   LIMIT 1;

  -- Motores: uno por barco
  INSERT INTO engines (ship_id, manufacturer, model, power_hp, engine_type, current_engine_hours)
  VALUES
    (ship_libertador,   'MAN B&W',     '6S50MC', 9480,  'DIESEL', 8200),
    (ship_san_martin,   'Wärtsilä',    '9L32',   3600,  'DIESEL', 12500),
    (ship_patagonia,    'MAN B&W',     '7S60MC', 14280, 'DIESEL', 3100),
    (ship_riodelaplata, 'Caterpillar', '3516B',  2200,  'DIESEL', 9800),
    (ship_belgrano,     'Volvo Penta', 'IPS',    800,   'DIESEL', 4400),
    (ship_cordoba,      'Cummins',     'KTA50',  1800,  'DIESEL', 6700);

  -- Tanques de combustible: uno por barco
  INSERT INTO ship_tanks (ship_id, tank_name, content_type, max_capacity_liters)
  VALUES
    (ship_libertador,   'Tanque Principal', 'FUEL', 45000.00),
    (ship_san_martin,   'Tanque Principal', 'FUEL', 95000.00),
    (ship_patagonia,    'Tanque Principal', 'FUEL', 140000.00),
    (ship_riodelaplata, 'Tanque Principal', 'FUEL', 78000.00),
    (ship_belgrano,     'Tanque Principal', 'FUEL', 18000.00),
    (ship_cordoba,      'Tanque Principal', 'FUEL', 52000.00);

  -- Mantenimientos
  -- Belgrano tiene uno IN_PROGRESS → status derivado = MAINTENANCE
  -- Río de la Plata sin registros → lastMaintenanceDate = null, status = OPERATIONAL
  INSERT INTO maintenance (ship_id, maintenance_type, description, scheduled_date, completed_date, status)
  VALUES
    (ship_libertador,  'PREVENTIVE', 'Mantenimiento preventivo de motores',     '2025-03-05', '2025-03-10', 'COMPLETED'),
    (ship_san_martin,  'PREVENTIVE', 'Inspección general de sistemas',           '2024-11-15', '2024-11-20', 'COMPLETED'),
    (ship_patagonia,   'CORRECTIVE', 'Revisión de sistemas hidráulicos',         '2025-01-10', '2025-01-15', 'COMPLETED'),
    (ship_belgrano,    'CORRECTIVE', 'Reparación del sistema de propulsión',     '2025-03-28', NULL,         'IN_PROGRESS'),
    (ship_cordoba,     'PREVENTIVE', 'Mantenimiento semestral de casco y motor', '2024-09-25', '2024-09-30', 'COMPLETED');

  RAISE NOTICE 'Ships related data seed completado: motores, tanques y mantenimientos insertados.';
END $$;
