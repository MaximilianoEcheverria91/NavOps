-- V{next_version}__rename_type_and_add_dock_type.sql

-- 1. Renombrar columna
ALTER TABLE ports
    RENAME COLUMN type TO port_type;

-- 2. Agregar nueva columna (permitiendo null temporalmente)
ALTER TABLE ports
    ADD COLUMN dock_type VARCHAR(80);

-- 3. Backfill (ajustá esto según tu lógica de negocio)
-- Ejemplo: valor por defecto
UPDATE ports
SET dock_type = 'SOLID_STRUCTURE'
WHERE dock_type IS NULL;

-- 4. Setear NOT NULL
ALTER TABLE ports
    ALTER COLUMN dock_type SET NOT NULL;