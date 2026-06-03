-- ==========================================================
-- MIGRACION V19: Unificacion de entidades de carga
-- Limpia tablas legacy (product, cargo_unit) y crea
-- travel_plan_cargo como entidad unificada.
-- ==========================================================

-- 1. ELIMINACION DE TABLAS ANTERIORES
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS cargo_unit CASCADE;

-- 2. CREACION DE LA NUEVA ENTIDAD UNIFICADA
CREATE TABLE travel_plan_cargo (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id uuid NOT NULL REFERENCES travel_plan(id) ON DELETE CASCADE,
    product_name varchar(150) NOT NULL,
    product_category varchar(80) NOT NULL,
    product_type varchar(80) NOT NULL,
    cargo_type varchar(50) NOT NULL,
    quantity integer NOT NULL,
    weight_tonnes numeric(10,2) NOT NULL,
    volume_m3 numeric(10,2) NOT NULL,
    owning_company varchar(200) NOT NULL,
    container_type varchar(80) NOT NULL,
    hazardous_material boolean NOT NULL DEFAULT false,
    description text,
    status varchar(80) NOT NULL,
    version integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);

-- 3. MEJORAS DE PERFORMANCE (INDICES)
CREATE INDEX idx_travel_plan_cargo_plan_id ON travel_plan_cargo(plan_id);
CREATE INDEX idx_travel_plan_cargo_updated_at ON travel_plan_cargo(updated_at);

-- 4. TRIGGER updated_at AUTOMATICO
CREATE TRIGGER update_travel_plan_cargo_modtime
    BEFORE UPDATE ON travel_plan_cargo
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
