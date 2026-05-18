-- =============================================================================
-- SEED DE 10 PUERTOS E INFRAESTRUCTURA (ARGENTINA - CABA)
-- =============================================================================

INSERT INTO ports (
    id, name, port_type, dock_type, code, contact_phone, contact_email, contact_web,
    timezone, latitude, longitude, dock_count, max_length, max_draft,
    country_id, province_id, city_id, status, is_active, version, created_at, updated_at
)
VALUES
    -- 2 Puertos en La Boca (cityId: c9cb8d00-bc32-4923-8191-472abcc528cb)
    (gen_random_uuid(), 'Puerto Sud Dock - Terminal 1', 'COMMERCIAL', 'SOLID_STRUCTURE', 'ARSUD1', '+54 11 4343-0001', 'info@sudt1.gob.ar', 'http://www.sudt1.com.ar', 'UTC-3', -34.6322, -58.3588, 8, 250.0, 9.5,
     '091d4938-75d4-468c-a546-0165d5cf4f52', '976fd852-4709-4581-839d-b20be15cf89e', 'c9cb8d00-bc32-4923-8191-472abcc528cb', 'OPERATIONAL', true, 0, NOW(), NOW()),

    (gen_random_uuid(), 'Astillero Boca Central', 'INDUSTRIAL', 'FLOATING', 'ARABC2', '+54 11 4343-0002', 'contacto@astilleroboca.com', 'http://www.astilleroboca.com.ar', 'UTC-3', -34.6401, -58.3612, 3, 180.0, 7.0,
     '091d4938-75d4-468c-a546-0165d5cf4f52', '976fd852-4709-4581-839d-b20be15cf89e', 'c9cb8d00-bc32-4923-8191-472abcc528cb', 'UNDER_MAINTENANCE', true, 0, NOW(), NOW()),

    -- 2 Puertos en Barracas (cityId: 22f382ca-7d08-4def-a803-cfb0f379338e)
    (gen_random_uuid(), 'Terminal Logística Riachuelo', 'LOGISTIC', 'SOLID_STRUCTURE', 'ARTLR3', '+54 11 4343-0003', 'logistica@riachuelo.com', null, 'UTC-3', -34.6510, -58.3745, 12, 220.0, 8.5,
     '091d4938-75d4-468c-a546-0165d5cf4f52', '976fd852-4709-4581-839d-b20be15cf89e', '22f382ca-7d08-4def-a803-cfb0f379338e', 'FULL', true, 0, NOW(), NOW()),

    (gen_random_uuid(), 'Puerto Ribera Barracas', 'FISHING', 'PIER_JETTY', 'ARPRB4', '+54 11 4343-0004', 'ribera@barracasports.com', 'http://www.riberabarracas.com', 'UTC-3', -34.6554, -58.3810, 5, 120.0, 6.0,
     '091d4938-75d4-468c-a546-0165d5cf4f52', '976fd852-4709-4581-839d-b20be15cf89e', '22f382ca-7d08-4def-a803-cfb0f379338e', 'CLOSED', true, 0, NOW(), NOW()),

    -- 2 Puertos en Belgrano (cityId: 4e688bab-d70f-4d41-96c4-c1fcf0b37f78)
    (gen_random_uuid(), 'Marina Turística Belgrano', 'TOURISTIC', 'FLOATING', 'ARMTB5', '+54 11 4343-0005', 'marina@belgranoclub.com', 'http://www.marinabelgrano.com.ar', 'UTC-3', -34.5420, -58.4310, 25, 45.0, 4.5,
     '091d4938-75d4-468c-a546-0165d5cf4f52', '976fd852-4709-4581-839d-b20be15cf89e', '4e688bab-d70f-4d41-96c4-c1fcf0b37f78', 'OPERATIONAL', true, 0, NOW(), NOW()),

    (gen_random_uuid(), 'Puerto de Enlace Norte', 'COMMERCIAL', 'DOLPHIN', 'ARPEN6', '+54 11 4343-0006', 'enlacenorte@navops.com', null, 'UTC-3', -34.5512, -58.4201, 4, 310.0, 11.0,
     '091d4938-75d4-468c-a546-0165d5cf4f52', '976fd852-4709-4581-839d-b20be15cf89e', '4e688bab-d70f-4d41-96c4-c1fcf0b37f78', 'INACTIVE', false, 0, NOW(), NOW()),

    -- 2 Puertos en Boedo (cityId: a2781cb4-4660-410e-9cf3-664b546e12ab)
    (gen_random_uuid(), 'Terminal Multimodal Boedo Cargo', 'LOGISTIC', 'SOLID_STRUCTURE', 'ARTMB7', '+54 11 4343-0007', 'cargo@boedoterminal.com', 'http://www.boedocargo.com', 'UTC-3', -34.6215, -58.4110, 6, 150.0, 7.5,
     '091d4938-75d4-468c-a546-0165d5cf4f52', '976fd852-4709-4581-839d-b20be15cf89e', 'a2781cb4-4660-410e-9cf3-664b546e12ab', 'OPERATIONAL', true, 0, NOW(), NOW()),

    (gen_random_uuid(), 'Puerto Seco de Integración', 'INDUSTRIAL', 'PIER_JETTY', 'ARPSI8', '+54 11 4343-0008', 'integracion@puertoseco.gob.ar', null, 'UTC-3', -34.6288, -58.4199, 2, 200.0, 8.0,
     '091d4938-75d4-468c-a546-0165d5cf4f52', '976fd852-4709-4581-839d-b20be15cf89e', 'a2781cb4-4660-410e-9cf3-664b546e12ab', 'CLOSED', true, 0, NOW(), NOW()),

    -- 2 Puertos en Caballito (cityId: 4a59d319-926c-4cae-bcac-a35d0ba7567a)
    (gen_random_uuid(), 'Terminal de Cruceros Caballito Sky', 'TOURISTIC', 'SOLID_STRUCTURE', 'ARTCS9', '+54 11 4343-0009', 'cruceros@caballitosky.com', 'http://www.caballitosky.com', 'UTC-3', -34.6130, -58.4420, 10, 330.0, 12.0,
     '091d4938-75d4-468c-a546-0165d5cf4f52', '976fd852-4709-4581-839d-b20be15cf89e', '4a59d319-926c-4cae-bcac-a35d0ba7567a', 'OPERATIONAL', true, 0, NOW(), NOW()),

    (gen_random_uuid(), 'Dársena de Suministros Internos', 'COMMERCIAL', 'DOLPHIN', 'ARDSI1', '+54 11 4343-0010', 'suministros@caballitoport.com', null, 'UTC-3', -34.6190, -58.4495, 4, 190.0, 9.0,
     '091d4938-75d4-468c-a546-0165d5cf4f52', '976fd852-4709-4581-839d-b20be15cf89e', '4a59d319-926c-4cae-bcac-a35d0ba7567a', 'FULL', true, 0, NOW(), NOW());