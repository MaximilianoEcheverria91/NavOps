-- =========================================
-- Actualización de tipos de barco
-- =========================================

-- Comerciales

-- Armada
UPDATE ships SET ship_type = 'CORVETTE' WHERE ship_type IN ('Corbeta MEKO 140');

UPDATE ships SET ship_type = 'DESTROYER' WHERE ship_type IN ('Destructor MEKO 360');

UPDATE ships SET ship_type = 'PATROL_BOAT' WHERE ship_type IN ('Patrullero');

UPDATE ships SET ship_type = 'OCEAN_PATROL_OPV' WHERE ship_type IN ('Patrullero Oceánico OPV');

UPDATE ships SET ship_type = 'NOTICE_SHIP' WHERE ship_type IN ('Aviso');

-- Servicios
UPDATE ships SET ship_type = 'TRAINING_SHIP' WHERE ship_type IN ('Buque Escuela');

UPDATE ships SET ship_type = 'ICEBREAKER' WHERE ship_type IN ('Rompehielos');





