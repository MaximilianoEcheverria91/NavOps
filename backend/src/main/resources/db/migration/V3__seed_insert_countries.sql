-- ==========================================================
-- 2. COUNTRIES
-- ==========================================================

INSERT INTO countries (id, country_name, iso_code, version)
VALUES
    (gen_random_uuid(), 'Argentina', 'AR', 0),
    (gen_random_uuid(), 'Brasil', 'BR', 0),
    (gen_random_uuid(), 'Paraguay', 'PY', 0),
    (gen_random_uuid(), 'Uruguay', 'UY', 0),
    (gen_random_uuid(), 'Chile', 'CL', 0);
