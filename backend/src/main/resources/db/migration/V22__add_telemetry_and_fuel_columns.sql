-- Migration: Add telemetry, fuel consumption, and engine tracking columns for real-time dashboard
-- Author: Maxi (NavOps Team)

-- 1. Agregar el consumo estimado de combustible a la tabla de motores (Litros por hora)
ALTER TABLE engines
    ADD COLUMN IF NOT EXISTS fuel_consumption_liters_per_hour NUMERIC(8,2) NOT NULL DEFAULT 250.00;

-- 2. Expandir la tabla travel_plan con columnas dinámicas para el seguimiento en tiempo real
ALTER TABLE travel_plan
    ADD COLUMN IF NOT EXISTS current_engine_status VARCHAR(50) NOT NULL DEFAULT 'OK',
    ADD COLUMN IF NOT EXISTS current_latitude NUMERIC(9,6),
    ADD COLUMN IF NOT EXISTS current_longitude NUMERIC(9,6),
    ADD COLUMN IF NOT EXISTS current_heading INTEGER DEFAULT 0;

-- 3. Comentarios de documentación en PostgreSQL para que el equipo entienda qué hace cada columna nueva
COMMENT ON COLUMN engines.fuel_consumption_liters_per_hour IS 'Consumo promedio estimado de fuel/gasoil en litros por hora de operación.';
COMMENT ON COLUMN travel_plan.current_engine_status IS 'Estado actual del motor reportado por telemetría (OK, WARNING, CRITICAL).';
COMMENT ON COLUMN travel_plan.current_latitude IS 'Última latitud registrada del buque durante la travesía activa.';
COMMENT ON COLUMN travel_plan.current_longitude IS 'Última longitud registrada del buque durante la travesía activa.';
COMMENT ON COLUMN travel_plan.current_heading IS 'Rumbo o dirección actual del buque en grados (0 a 360).';