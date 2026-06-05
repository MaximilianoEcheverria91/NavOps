-- 🚀 Hacemos que la columna acepte valores Nulos para cargas sueltas
ALTER TABLE travel_plan_cargo ALTER COLUMN container_type DROP NOT NULL;