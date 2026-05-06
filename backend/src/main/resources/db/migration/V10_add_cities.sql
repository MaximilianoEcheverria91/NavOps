INSERT INTO cities (name, province_id)
SELECT c.name, p.id
FROM (
         VALUES
             ('Carlos Casares', 'Buenos Aires'),
             ('Olavarria', 'Buenos Aires'),
             ('Carlos Spegazzini', 'Buenos Aires'),
             ('Coronel Brandsen', 'Buenos Aires'),
             ('Lobos', 'Buenos Aires'),
             ('Tandil', 'Buenos Aires'),
             ('San Pedro', 'Buenos Aires'),
             ('Dolores', 'Buenos Aires'),
             ('Canning', 'Buenos Aires'),
             ('San Justo', 'Buenos Aires'),
             ('Ingeniero Budge', 'Buenos Aires'),
             ('José Mármol', 'Buenos Aires'),
             ('Villa Fiorito', 'Buenos Aires'),
             ('Tristan Suárez', 'Buenos Aires'),
             ('Ezeiza', 'Buenos Aires'),
             ('Glew', 'Buenos Aires'),
             ('Monte Grande', 'Buenos Aires'),
             ('Lavallol', 'Buenos Aires'),
             ('Turdera', 'Buenos Aires'),
             ('Adrogué', 'Buenos Aires'),
             ('Morón', 'Buenos Aires'),
             ('Remedios de Escalada', 'Buenos Aires'),
             ('Gerli', 'Buenos Aires'),
             ('Avellaneda', 'Buenos Aires'),
             ('Banfield', 'Buenos Aires'),
             ('Bahía Blanca''', 'Buenos Aires'),
             ('Mar del Plata', 'Buenos Aires'),
             ('Valentin Alsina', 'Buenos Aires', 1),
             ('Burzaco', 'Buenos Aires', 1),
             ('Florencio Varela', 'Buenos Aires', 1),
             ('Bosques', 'Buenos Aires', 1),
             ('Pergamino', 'Buenos Aires', 1),
             ('Quilmes', 'Buenos Aires', 1),

             ('Rosario', 'Santa Fe'),
             ('Córdoba Capital', 'Córdoba')
     ) AS c(name, province_name)
         JOIN provinces p ON p.name = c.province_name
    ON CONFLICT (name, province_id) DO NOTHING;


INSERT INTO cities (name, province_id, version)
VALUES

-- BUENOS AIRES
('La Plata', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Mar del Plata', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Bahía Blanca', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Banfield', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Avellaneda', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Gerli', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Remedios de Escalada', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Morón', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Adrogué', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Turdera', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Lavallol', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Monte Grande', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Glew', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Ezeiza', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Tristan Suárez', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Villa Fiorito', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('José Mármol', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Ingeniero Budge', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('San Justo', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Canning', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Dolores', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('San Pedro', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Tandil', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Lobos', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Coronel Brandsen', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Carlos Spegazzini', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Olavarria', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Carlos Casares', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Valentin Alsina', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Burzaco', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Florencio Varela', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Bosques', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Pergamino', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),
('Quilmes', '3b62ce72-2517-43c6-a630-77a0593103ba', 1),

-- Buenos aires-CABA
('Palermo', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Puerto Madero', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Monserrat', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('San Telmo', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Retiro', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Recoleta', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Balvanera', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Parque Patricios', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('La Boca', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('San Nicolas', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Parque Chacabuco', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Almagro', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Flores', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Floresta', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Caballito', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Villa Lugano', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Liniers', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Villa del Parque', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Nueva Pompeya', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Parque Avellaneda', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Villa Devoto', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Villa Urquiza', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Belgrano', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Núñez', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Saavedra', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Palermo Chico', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Palermo Soho', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Villa Crespo ', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('La Paternal', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),
('Villa Luro', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1),

-- CÓRDOBA
('Villa Carlos Paz', '0184e45f-380b-4def-b790-96f370070f7a', 1),
('Río Cuarto', '0184e45f-380b-4def-b790-96f370070f7a', 1),
('Villa María', '0184e45f-380b-4def-b790-96f370070f7a', 1),
('San Francisco', '0184e45f-380b-4def-b790-96f370070f7a', 1),

-- SANTA FE
('Santa Fe', '61da78c7-02f6-4e91-9e52-e744c5be9777', 1),
('Rafaela', '61da78c7-02f6-4e91-9e52-e744c5be9777', 1),
('Venado Tuerto', '61da78c7-02f6-4e91-9e52-e744c5be9777', 1),
('Reconquista', '61da78c7-02f6-4e91-9e52-e744c5be9777', 1),

-- MENDOZA
('Mendoza', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 1),
('San Rafael', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 1),
('Godoy Cruz', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 1),
('Maipú', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 1),
('Luján de Cuyo', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 1),

-- SALTA
('Salta', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 1),
('Tartagal', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 1),
('Orán', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 1),
('Metán', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 1),
('Cafayate', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 1),

-- =========================================
-- Brazil
-- =========================================

-- São Paulo
('São Paulo', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 1),
('Campinas', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 1),
('Santos', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 1),
('Guarulhos', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 1),
('São Bernardo do Campo', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 1),

-- Rio de Janeiro
('Rio de Janeiro', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 1),
('Niterói', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 1),
('Petrópolis', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 1),
('Volta Redonda', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 1),
('Campos dos Goytacazes', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 1),

-- Bahía
('Salvador', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 1),
('Feira de Santana', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 1),
('Ilhéus', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 1),
('Itabuna', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 1),
('Juazeiro', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 1),

-- Minas Gerais
('Belo Horizonte', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 1),
('Uberlândia', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 1),
('Contagem', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 1),
('Juiz de Fora', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 1),
('Betim', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 1),

-- Paraná
('Curitiba', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', 1),
('Londrina', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', 1),
('Maringá', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', 1),
('Foz do Iguaçu', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', 1),
('Ponta Grossa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', 1),

-- =========================================
-- Chile
-- =========================================

-- Región Metropolitana
('Santiago', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 1),
('Puente Alto', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 1),
('Maipú', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 1),
('Las Condes', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 1),
('La Florida', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 1),

-- Valparaíso
('Valparaíso', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 1),
('Viña del Mar', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 1),
('Quilpué', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 1),
('Villa Alemana', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 1),
('San Antonio', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 1),

-- Biobío
('Concepción', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 1),
('Talcahuano', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 1),
('Chillán', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 1),
('Los Ángeles', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 1),
('Coronel', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 1),

-- Antofagasta
('Antofagasta', 'cccccccc-cccc-cccc-cccc-ccccccccccc4', 1),
('Calama', 'cccccccc-cccc-cccc-cccc-ccccccccccc4', 1),
('Tocopilla', 'cccccccc-cccc-cccc-cccc-ccccccccccc4', 1),
('Mejillones', 'cccccccc-cccc-cccc-cccc-ccccccccccc4', 1),
('San Pedro de Atacama', 'cccccccc-cccc-cccc-cccc-ccccccccccc4', 1),

-- Coquimbo
('La Serena', 'cccccccc-cccc-cccc-cccc-ccccccccccc5', 1),
('Coquimbo', 'cccccccc-cccc-cccc-cccc-ccccccccccc5', 1),
('Ovalle', 'cccccccc-cccc-cccc-cccc-ccccccccccc5', 1),
('Illapel', 'cccccccc-cccc-cccc-cccc-ccccccccccc5', 1),
('Vicuña', 'cccccccc-cccc-cccc-cccc-ccccccccccc5', 1),

-- =========================================
-- Uruguay
-- =========================================
-- Montevideo
('Montevideo', 'dddddddd-dddd-dddd-dddd-ddddddddddd1', 1),
('Ciudad Vieja', 'dddddddd-dddd-dddd-dddd-ddddddddddd1', 1),
('Pocitos', 'dddddddd-dddd-dddd-dddd-ddddddddddd1', 1),
('Carrasco', 'dddddddd-dddd-dddd-dddd-ddddddddddd1', 1),
('Buceo', 'dddddddd-dddd-dddd-dddd-ddddddddddd1', 1),

-- Canelones
('Las Piedras', 'dddddddd-dddd-dddd-dddd-ddddddddddd2', 1),
('Pando', 'dddddddd-dddd-dddd-dddd-ddddddddddd2', 1),
('Atlántida', 'dddddddd-dddd-dddd-dddd-ddddddddddd2', 1),
('La Paz', 'dddddddd-dddd-dddd-dddd-ddddddddddd2', 1),
('Santa Lucía', 'dddddddd-dddd-dddd-dddd-ddddddddddd2', 1),

-- Maldonado
('Punta del Este', 'dddddddd-dddd-dddd-dddd-ddddddddddd3', 1),
('San Carlos', 'dddddddd-dddd-dddd-dddd-ddddddddddd3', 1),
('Maldonado', 'dddddddd-dddd-dddd-dddd-ddddddddddd3', 1),
('Piriápolis', 'dddddddd-dddd-dddd-dddd-ddddddddddd3', 1),
('Aiguá', 'dddddddd-dddd-dddd-dddd-ddddddddddd3', 1),

-- Colonia
('Colonia del Sacramento', 'dddddddd-dddd-dddd-dddd-ddddddddddd4', 1),
('Carmelo', 'dddddddd-dddd-dddd-dddd-ddddddddddd4', 1),
('Nueva Helvecia', 'dddddddd-dddd-dddd-dddd-ddddddddddd4', 1),
('Juan Lacaze', 'dddddddd-dddd-dddd-dddd-ddddddddddd4', 1),
('Rosario', 'dddddddd-dddd-dddd-dddd-ddddddddddd4', 1),

-- Salto
('Salto', 'dddddddd-dddd-dddd-dddd-ddddddddddd5', 1),
('Constitución', 'dddddddd-dddd-dddd-dddd-ddddddddddd5', 1),
('Belén', 'dddddddd-dddd-dddd-dddd-ddddddddddd5', 1),
('Daymán', 'dddddddd-dddd-dddd-dddd-ddddddddddd5', 1),
('San Antonio', 'dddddddd-dddd-dddd-dddd-ddddddddddd5', 1),

-- =========================================
-- Paraguay
-- =========================================
-- Asunción
('Asunción', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 1),
('Villa Morra', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 1),
('San Lorenzo', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 1),
('Lambaré', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 1),
('Fernando de la Mora', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 1),

-- Central
('Luque', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 1),
('Capiatá', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 1),
('Itauguá', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 1),
('Ypacaraí', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 1),
('Areguá', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 1),

-- Alto Paraná
('Ciudad del Este', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', 1),
('Hernandarias', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', 1),
('Presidente Franco', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', 1),
('Minga Guazú', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', 1),
('Santa Rita', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', 1),

-- Itapúa
('Encarnación', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee4', 1),
('Cambyretá', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee4', 1),
('San Juan del Paraná', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee4', 1),
('Coronel Bogado', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee4', 1),
('Hohenau', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee4', 1),

-- Cordillera
('Caacupé', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee5', 1),
('Eusebio Ayala', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee5', 1),
('Tobatí', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee5', 1),
('Altos', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee5', 1),
('Arroyos y Esteros', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee5', 1)
