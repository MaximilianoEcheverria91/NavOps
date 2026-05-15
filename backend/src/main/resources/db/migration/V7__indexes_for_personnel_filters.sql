-- =============================================================================
-- ÍNDICES OPTIMIZADOS PARA FILTROS AVANZADOS DE PERSONAL
-- =============================================================================
-- IMPORTANTE: Ejecutar V6_1__enable_pg_trgm_extension.sql ANTES de este archivo
-- si se desean índices de búsqueda difusa.
-- =============================================================================

-- ÍNDICE COMPUESTO PARA LOCALIDAD (País > Provincia > Ciudad)
CREATE INDEX IF NOT EXISTS idx_people_country_province_city
    ON people(country_id, province_id, city_id);

-- ÍNDICE PARA ESTADO DE PERSONA
CREATE INDEX IF NOT EXISTS idx_people_status
    ON people(status)
    WHERE deleted_at IS NULL;

-- ÍNDICE PARA FECHA DE NACIMIENTO (cálculo de edad)
CREATE INDEX IF NOT EXISTS idx_people_birth_date
    ON people(birth_date);

-- ÍNDICE COMPUESTO PARA UBICACIÓN + ESTADO
CREATE INDEX IF NOT EXISTS idx_people_location_status
    ON people(country_id, status)
    WHERE deleted_at IS NULL;

-- ÍNDICE PARA TRIPULANTES - POSICIÓN Y ESTADO LABORAL
CREATE INDEX IF NOT EXISTS idx_crew_members_navigation_status
    ON crew_members(navigation_role, current_status)
    WHERE deleted_at IS NULL;

-- ÍNDICE PARA FECHA DE CONTRATACIÓN
CREATE INDEX IF NOT EXISTS idx_crew_members_hire_date
    ON crew_members(hire_date)
    WHERE deleted_at IS NULL;

-- ÍNDICE PARA USUARIOS - ACCESO AL SISTEMA
CREATE INDEX IF NOT EXISTS idx_users_active_blocked
    ON users(is_active, is_blocked)
    WHERE deleted_at IS NULL;

-- ÍNDICE COMPUESTO PARA ROLES DE USUARIO
CREATE INDEX IF NOT EXISTS idx_users_role
    ON users(role_id, is_active)
    WHERE deleted_at IS NULL;

-- ÍNDICE PARA ORDENAMIENTO POR APELLIDO/NOMBRE
CREATE INDEX IF NOT EXISTS idx_people_surname_name
    ON people(surname, full_name)
    WHERE deleted_at IS NULL;

-- ÍNDICE PARA NÚMERO DE LEGAJO
CREATE INDEX IF NOT EXISTS idx_crew_members_file_number
    ON crew_members(file_number)
    WHERE deleted_at IS NULL;

-- ÍNDICE PARA LIBRETA MARÍTIMA
CREATE INDEX IF NOT EXISTS idx_crew_members_maritime_book
    ON crew_members(maritime_book_number)
    WHERE deleted_at IS NULL;
