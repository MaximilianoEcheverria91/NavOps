--------------------------------------------
-- INSERT DE PROVINCIA
--------------------------------------------

INSERT INTO provinces (id, name, country_id, version, created_at, updated_at)
SELECT
    gen_random_uuid(), -- Genera el ID
    p.name,
    c.id,
    0,                 -- Inicializa versión en 0
    NOW(),             -- Fecha creación
    NOW()              -- Fecha actualización
FROM (
         VALUES
             -- Provincias de Argentina

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
             ('Tucumán', 'AR'),

             -- Provincias de Brasil

             ('São Paulo', 'BR'),
             ('Río de Janeiro', 'BR'),
             ('Minas Gerais', 'BR'),
             ('Distrito Federal', 'BR'),
             ('Bahía', 'BR'),

             -- Provincias de Paraguay

             ('Asunción', 'PY'),
             ('Central', 'PY'),
             ('Alto Paraná', 'PY'),
             ('Itapúa', 'PY'),
             ('Cordillera', 'PY'),

             -- Provincias de Uruguay

             ('Montevideo', 'UY'),
             ('Canelones', 'UY'),
             ('Maldonado', 'UY'),
             ('Colonia', 'UY'),
             ('Salto', 'UY'),

             -- Provincia de Chile

             ('Región Metropolitana', 'CL'),
             ('Valparaíso', 'CL'),
             ('Biobío', 'CL'),
             ('Antofagasta', 'CL'),
             ('Coquimbo', 'CL')
     ) AS p(name, iso_code)
         JOIN countries c ON c.iso_code = p.iso_code
    ON CONFLICT (name, country_id) DO NOTHING;
