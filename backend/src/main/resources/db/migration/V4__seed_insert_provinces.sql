INSERT INTO provinces (name, country_id)
SELECT
    p.name,
    c.id
FROM (
         VALUES
             ('Buenos Aires', 'AR'),
             ('Ciudad Autónoma de Buenos Aires', 'AR'),
             ('Gran Buenos Aires', 'AR'),
             ('Catamarca', 'AR'),
             ('Chaco', 'AR'),
             ('Chubut', 'AR'),
             ('Córdoba', 'AR'),
             ('Corrientes', 'AR'),
             ('Entre Ríos', 'AR'),
             ('Formosa', 'AR'),
             ('Jujuy', 'AR'),
             ('La Pampa', 'AR'),
             ('La Rioja', 'AR'),
             ('Mendoza', 'AR'),
             ('Misiones', 'AR'),
             ('Neuquén', 'AR'),
             ('Río Negro', 'AR'),
             ('Salta', 'AR'),
             ('San Juan', 'AR'),
             ('San Luis', 'AR'),
             ('Santa Cruz', 'AR'),
             ('Santa Fe', 'AR'),
             ('Santiago del Estero', 'AR'),
             ('Tierra del Fuego', 'AR'),
             ('Tucumán', 'AR')
     ) AS p(name, iso_code)
         JOIN countries c
              ON c.iso_code = p.iso_code
    ON CONFLICT (name, country_id) DO NOTHING;

-- =========================
-- BRASIL
-- =========================

INSERT INTO provinces (name, country_id)
SELECT
    p.name,
    c.id
FROM (
         VALUES
             ('São Paulo', 'BR'),
             ('Río de Janeiro', 'BR'),
             ('Minas Gerais', 'BR'),
             ('Distrito Federal', 'BR'),
             ('Bahía', 'BR')
     ) AS p(name, iso_code)
         JOIN countries c
              ON c.iso_code = p.iso_code
    ON CONFLICT (name, country_id) DO NOTHING;

-- =========================
-- PARAGUAY
-- =========================

INSERT INTO provinces (name, country_id)
SELECT
    p.name,
    c.id
FROM (
         VALUES
             ('Asunción', 'PY'),
             ('Central', 'PY'),
             ('Alto Paraná', 'PY'),
             ('Itapúa', 'PY'),
             ('Cordillera', 'PY')
     ) AS p(name, iso_code)
         JOIN countries c
              ON c.iso_code = p.iso_code
    ON CONFLICT (name, country_id) DO NOTHING;

-- =========================
-- URUGUAY
-- =========================

INSERT INTO provinces (name, country_id)
SELECT
    p.name,
    c.id
FROM (
         VALUES
             ('Montevideo', 'UY'),
             ('Canelones', 'UY'),
             ('Maldonado', 'UY'),
             ('Colonia', 'UY'),
             ('Salto', 'UY')
     ) AS p(name, iso_code)
         JOIN countries c
              ON c.iso_code = p.iso_code
    ON CONFLICT (name, country_id) DO NOTHING;


-- =========================
-- CHILE
-- =========================

INSERT INTO provinces (name, country_id)
SELECT
    p.name,
    c.id
FROM (
         VALUES
             ('Región Metropolitana', 'CL'),
             ('Valparaíso', 'CL'),
             ('Biobío', 'CL'),
             ('Antofagasta', 'CL'),
             ('Coquimbo', 'CL')
     ) AS p(name, iso_code)
         JOIN countries c
              ON c.iso_code = p.iso_code
    ON CONFLICT (name, country_id) DO NOTHING;