INSERT INTO cities (
    name,
    province_id
)
SELECT
    c.city_name,
    p.id
FROM (
         VALUES
             ('Punta alta', 'Buenos Aires', 'AR'),
             ('Zárate', 'Buenos Aires', 'AR'),
             ('Retiro', 'Ciudad Autónoma de Buenos Aires', 'AR'),
             ('Isla de los Estados', 'Tierra del Fuego', 'AR')
     ) AS c(city_name, province_name, iso_code)
         JOIN provinces p
              ON p.name = c.province_name
         JOIN countries co
              ON co.id = p.country_id
                  AND co.iso_code = c.iso_code
    ON CONFLICT (name, province_id) DO NOTHING;