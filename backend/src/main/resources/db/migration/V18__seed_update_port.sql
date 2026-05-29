INSERT INTO ports (
    id,
    name,
    port_type,
    dock_type,
    code,
    contact_phone,
    contact_email,
    contact_web,
    timezone,
    latitude,
    longitude,
    dock_count,
    max_length,
    max_draft,
    country_id,
    province_id,
    city_id,
    status,
    is_active,
    version,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    p.name,
    p.port_type,
    p.dock_type,
    p.code,
    p.contact_phone,
    p.contact_email,
    p.contact_web,
    'UTC-3',
    p.latitude,
    p.longitude,
    p.dock_count,
    p.max_length,
    p.max_draft,
    c.id,
    pr.id,
    ci.id,
    p.status,
    p.is_active,
    0,
    NOW(),
    NOW()
FROM (
         VALUES
             (
                 'Apostadero Naval Buenos Aires',
                 'MILITARY',
                 'SOLID_STRUCTURE',
                 'ARPB1',
                 '+54 11 4317-7000',
                 'ApostaderoNaval@gmail.gov.ar',
                 'https://www.ApostaderoNaval.gob.ar',
                 -34.593800,
                 -58.368401,
                 12,
                 350.0,
                 10.5,
                 'OPERATIONAL',
                 true,
                 'AR',
                 'Ciudad Autónoma de Buenos Aires',
                 'Retiro'
             ),

             (
                 'Base Naval Puerto Belgrano',
                 'MILITARY',
                 'SOLID_STRUCTURE',
                 'ARDSD',
                 '+54 11 4201-9900',
                 'PuertoBelgrano@gmail.com.ar',
                 NULL,
                 -38.891243,
                 -62.106973,
                 8,
                 280.0,
                 9.0,
                 'OPERATIONAL',
                 true,
                 'AR',
                 'Buenos Aires',
                 'Punta alta'
             ),

             (
                 'Base Naval Mar del Plata',
                 'MILITARY',
                 'SOLID_STRUCTURE',
                 'ARPL3',
                 '+54 221 412-8000',
                 'info@puertoMardelPlata.com.ar',
                 'https://www.puertoMardelPlata.com.ar',
                 -38.034346,
                 -57.535136,
                 10,
                 300.0,
                 10.0,
                 'OPERATIONAL',
                 true,
                 'AR',
                 'Buenos Aires',
                 'Mar del Plata'
             ),

             (
                 'Base Naval Ushuaia',
                 'MILITARY',
                 'SOLID_STRUCTURE',
                 'ARMD4',
                 '+54 223 499-7000',
                 'BaseNavalUshuaia@gmail.gob.ar',
                 'https://www.BaseNavalUshuaia.com.ar',
                 -54.805876,
                 -68.294248,
                 15,
                 220.0,
                 8.5,
                 'OPERATIONAL',
                 true,
                 'AR',
                 'Tierra del Fuego',
                 'Ushuaia'
             ),

             (
                 'Base Naval Zárate',
                 'MILITARY',
                 'DOLPHIN',
                 'ARRS5',
                 '+54 341 410-1200',
                 'baseNavalZarate@gmail.com.ar',
                 NULL,
                 -34.082556,
                 -59.018677,
                 1,
                 270.0,
                 9.5,
                 'FULL',
                 true,
                 'AR',
                 'Buenos Aires',
                 'Zárate'
             ),

             (
                 'Puerto Madryn Cruise Ship Pier',
                 'TOURISTIC',
                 'DOLPHIN',
                 'ARB11',
                 '+54 291 459-5000',
                 'puertoMadryn@gmail.com.ar',
                 'https://www.puertoMadryn.com.ar',
                 -42.762106,
                 -65.023837,
                 3,
                 400.0,
                 13.0,
                 'OPERATIONAL',
                 true,
                 'AR',
                 'Chubut',
                 'Puerto Madryn'
             )

     ) AS p(
            name,
            port_type,
            dock_type,
            code,
            contact_phone,
            contact_email,
            contact_web,
            latitude,
            longitude,
            dock_count,
            max_length,
            max_draft,
            status,
            is_active,
            iso_code,
            province_name,
            city_name
    )

         JOIN countries c
              ON c.iso_code = p.iso_code

         JOIN provinces pr
              ON pr.name = p.province_name
                  AND pr.country_id = c.id

         JOIN cities ci
              ON ci.name = p.city_name
                  AND ci.province_id = pr.id;