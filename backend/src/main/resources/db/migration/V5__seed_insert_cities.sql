-- =========================
-- Argentina- Buenos Aires
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('La Plata', 'Buenos Aires'),
             ('Mar del Plata', 'Buenos Aires'),
             ('Bahía Blanca', 'Buenos Aires'),
             ('Tandil', 'Buenos Aires'),
             ('San Nicolás de los Arroyos', 'Buenos Aires'),
             ('Junin', 'Buenos Aires'),
             ('Olavarria', 'Buenos Aires'),
             ('Pergamino', 'Buenos Aires'),
             ('Necochea', 'Buenos Aires'),
             ('Luján', 'Buenos Aires'),
             ('Mercedes', 'Buenos Aires'),
             ('Azul', 'Buenos Aires'),
             ('Chivilcoy', 'Buenos Aires'),
             ('Zárate', 'Buenos Aires'),
             ('Campana', 'Buenos Aires'),
             ('Chascomús', 'Buenos Aires'),
             ('Balcarce', 'Buenos Aires'),
             ('Villa Gesell', 'Buenos Aires'),
             ('Pinamar', 'Buenos Aires'),
             ('San Antonio de Areco', 'Buenos Aires')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Ciudad Autónoma de Buenos Aires
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Palermo', 'Ciudad Autónoma de Buenos Aires'),
             ('Recoleta', 'Ciudad Autónoma de Buenos Aires'),
             ('San Telmo', 'Ciudad Autónoma de Buenos Aires'),
             ('Puerto Madero', 'Ciudad Autónoma de Buenos Aires'),
             ('Belgrano', 'Ciudad Autónoma de Buenos Aires'),
             ('Caballito', 'Ciudad Autónoma de Buenos Aires'),
             ('Almagro', 'Ciudad Autónoma de Buenos Aires'),
             ('Boedo', 'Ciudad Autónoma de Buenos Aires'),
             ('La Boca', 'Ciudad Autónoma de Buenos Aires'),
             ('Flores', 'Ciudad Autónoma de Buenos Aires'),
             ('Villa Urquiza', 'Ciudad Autónoma de Buenos Aires'),
             ('Villa Devoto', 'Ciudad Autónoma de Buenos Aires'),
             ('Balvanera', 'Ciudad Autónoma de Buenos Aires'),
             ('Constitución', 'Ciudad Autónoma de Buenos Aires'),
             ('Monserrat', 'Ciudad Autónoma de Buenos Aires'),
             ('Chacarita', 'Ciudad Autónoma de Buenos Aires'),
             ('Nuñes', 'Ciudad Autónoma de Buenos Aires'),
             ('Colegiales', 'Ciudad Autónoma de Buenos Aires'),
             ('Barracas', 'Ciudad Autónoma de Buenos Aires'),
             ('Mataderos', 'Ciudad Autónoma de Buenos Aires')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Gran Buenos Aires
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Avellaneda', 'Gran Buenos Aires'),
             ('Lanús', 'Gran Buenos Aires'),
             ('Lomas de Zamora', 'Gran Buenos Aires'),
             ('Quilmes', 'Gran Buenos Aires'),
             ('San Isidro', 'Gran Buenos Aires'),
             ('Vicente Lopez', 'Gran Buenos Aires'),
             ('Moron', 'Gran Buenos Aires'),
             ('San Justo', 'Gran Buenos Aires'),
             ('Tigre', 'Gran Buenos Aires'),
             ('Pilar', 'Gran Buenos Aires'),
             ('Escobar', 'Gran Buenos Aires'),
             ('Moreno', 'Gran Buenos Aires'),
             ('Merlo', 'Gran Buenos Aires'),
             ('Florencio Varela', 'Gran Buenos Aires'),
             ('Berazategui', 'Gran Buenos Aires'),
             ('Ezeiza', 'Gran Buenos Aires'),
             ('San Miguel', 'Gran Buenos Aires'),
             ('Ituzaingó', 'Gran Buenos Aires'),
             ('Hurlingham', 'Gran Buenos Aires'),
             ('Caseros', 'Gran Buenos Aires'),
             ('Esteban Echeverría', 'Gran Buenos Aires'),
             ('Almirante Brown', 'Gran Buenos Aires'),
             ('General Rodriguez', 'Gran Buenos Aires'),
             ('Jose C. Paz', 'Gran Buenos Aires'),
             ('Malvinas Argentinas', 'Gran Buenos Aires'),
             ('Ramos Mejia', 'Gran Buenos Aires'),
             ('Gregorio de Laferrere', 'Gran Buenos Aires'),
             ('Gonzales Catán', 'Gran Buenos Aires'),
             ('Virrey del Pino', 'Gran Buenos Aires')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Catamarca
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('San Fernando del Valle de Catamarca', 'Catamarca'),
             ('Valle Viejo', 'Catamarca'),
             ('Belén', 'Catamarca'),
             ('Andalgalá', 'Catamarca'),
             ('Tinogasta', 'Catamarca'),
             ('Fiambalá', 'Catamarca'),
             ('Santa María', 'Catamarca'),
             ('Recreo', 'Catamarca'),
             ('Saujil', 'Catamarca'),
             ('San José', 'Catamarca')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Chaco
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Resistencia', 'Chaco'),
             ('Presidencia Roque Sáenz Peña', 'Chaco'),
             ('Villa Ángela', 'Chaco'),
             ('Charata', 'Chaco'),
             ('General José de San Martín', 'Chaco'),
             ('Juan José Castelli', 'Chaco'),
             ('Quitilipi', 'Chaco'),
             ('Las Breñas', 'Chaco'),
             ('Barranqueras', 'Chaco'),
             ('Fontana', 'Chaco')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Chubut
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Rawson', 'Chubut'),
             ('Comodoro Rivadavia', 'Chubut'),
             ('Trelew', 'Chubut'),
             ('Puerto Madryn', 'Chubut'),
             ('Esquel', 'Chubut'),
             ('Sarmiento', 'Chubut'),
             ('Gaiman', 'Chubut'),
             ('El Maitén', 'Chubut'),
             ('Rada Tilly', 'Chubut'),
             ('Lago Puelo', 'Chubut')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;


-- =========================
-- Argentina- Córdoba
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Córdoba Capital', 'Córdoba'),
             ('Villa Carlos Paz', 'Córdoba'),
             ('Río Cuarto', 'Córdoba'),
             ('Villa María', 'Córdoba'),
             ('San Francisco', 'Córdoba'),
             ('Alta Gracia', 'Córdoba'),
             ('Jesús María', 'Córdoba'),
             ('Río Tercero', 'Córdoba'),
             ('Bell Ville', 'Córdoba'),
             ('Villa General Belgrano', 'Córdoba')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Corrientes
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Corrientes Capital', 'Corrientes'),
             ('Goya', 'Corrientes'),
             ('Paso de los Libres', 'Corrientes'),
             ('Curuzú Cuatiá', 'Corrientes'),
             ('Mercedes', 'Corrientes'),
             ('Bella Vista', 'Corrientes'),
             ('Santo Tomé', 'Corrientes'),
             ('Monte Caseros', 'Corrientes'),
             ('Ituzaingó', 'Corrientes'),
             ('Esquina', 'Corrientes')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Entre Ríos
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Paraná', 'Entre Ríos'),
             ('Concordia', 'Entre Ríos'),
             ('Gualeguaychú', 'Entre Ríos'),
             ('Concepción del Uruguay', 'Entre Ríos'),
             ('Federación', 'Entre Ríos'),
             ('Villaguay', 'Entre Ríos'),
             ('Chajarí', 'Entre Ríos'),
             ('Victoria', 'Entre Ríos'),
             ('Colón', 'Entre Ríos'),
             ('Nogoyá', 'Entre Ríos')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Formosa
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Formosa Capital', 'Formosa'),
             ('Clorinda', 'Formosa'),
             ('Pirané', 'Formosa'),
             ('EL Colorado', 'Formosa'),
             ('Las Lomitas', 'Formosa'),
             ('Ibarreta', 'Formosa'),
             ('Ingeniero Juárez', 'Formosa'),
             ('Espinillo', 'Formosa'),
             ('Laguna Blanca', 'Formosa'),
             ('Comandante Fontana', 'Formosa')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Jujuy
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('San Salvador de Jujuy', 'Jujuy'),
             ('San Pedro de Jujuy', 'Jujuy'),
             ('Libertador General San Martín:', 'Jujuy'),
             ('Perico', 'Jujuy'),
             ('Palpalá', 'Jujuy'),
             ('Humahuaca', 'Jujuy'),
             ('Tilcara', 'Jujuy'),
             ('La Quiaca', 'Jujuy'),
             ('Abra Pampa', 'Jujuy'),
             ('Purmamarca', 'Jujuy')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- La Pampa
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Santa rosa', 'La Pampa'),
             ('General Pico', 'La Pampa'),
             ('General Acha', 'La Pampa'),
             ('Eduardo Castex', 'La Pampa'),
             ('Toay', 'La Pampa'),
             ('Realicó', 'La Pampa'),
             ('Victorica', 'La Pampa'),
             ('25 de Mayo', 'La Pampa'),
             ('Intendente Alvear', 'La Pampa'),
             ('Guatraché', 'La Pampa')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- La Rioja
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('La Rioja Capital', 'La Rioja'),
             ('Chilecito', 'La Rioja'),
             ('Aimogasta', 'La Rioja'),
             ('Villa Unión', 'La Rioja'),
             ('Chamical', 'La Rioja'),
             ('Chepes', 'La Rioja'),
             ('Famatina', 'La Rioja'),
             ('Vinchina', 'La Rioja'),
             ('Anillaco', 'La Rioja'),
             ('Olta', 'La Rioja')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Mendoza
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Mendoza Capital', 'Mendoza'),
             ('San Rafael', 'Mendoza'),
             ('Godoy Cruz', 'Mendoza'),
             ('Guaymallén', 'Mendoza'),
             ('Luján de Cuyo', 'Mendoza'),
             ('Maipú', 'Mendoza'),
             ('Tunuyán', 'Mendoza'),
             ('Malargüe', 'Mendoza'),
             ('General Alvear', 'Mendoza'),
             ('Rivadavia', 'Mendoza')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Misiones
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Posada', 'Misiones'),
             ('Puerto Iguazú', 'Misiones'),
             ('Oberá', 'Misiones'),
             ('Eldorado', 'Misiones'),
             ('Apóstoles', 'Misiones'),
             ('San Vicente', 'Misiones'),
             ('Jardín América', 'Misiones'),
             ('Puerto Rico', 'Misiones'),
             ('Montecarlo', 'Misiones'),
             ('San Ignacio', 'Misiones')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Neuquén
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Neuquén Capital', 'Neuquén'),
             ('San Martin de los Andes', 'Neuquén'),
             ('Añelo', 'Neuquén'),
             ('Cutral Có', 'Neuquén'),
             ('Zapata', 'Neuquén'),
             ('Villa La Angostura', 'Neuquén'),
             ('Centenario', 'Neuquén'),
             ('Plottier', 'Neuquén'),
             ('Chos Malal', 'Neuquén'),
             ('Junín de los Andes', 'Neuquén')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Río Negro
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Viedma', 'Río Negro'),
             ('San Carlos de Bariloche', 'Río Negro'),
             ('General Roca', 'Río Negro'),
             ('Cipolletti', 'Río Negro'),
             ('Las Grutas', 'Río Negro'),
             ('San Antonio Oeste', 'Río Negro'),
             ('Villa Regina', 'Río Negro'),
             ('El Bolsón', 'Río Negro'),
             ('Cinco Saltos', 'Río Negro'),
             ('Catriel', 'Río Negro')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Salta
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Salta Capital', 'Salta'),
             ('San Ramón de la Nueva Orán', 'Salta'),
             ('Tartagal', 'Salta'),
             ('Cafayate', 'Salta'),
             ('General Güemes', 'Salta'),
             ('San José de Metán', 'Salta'),
             ('Rosario de la Frontera', 'Salta'),
             ('Pichanal', 'Salta'),
             ('Embarcación', 'Salta'),
             ('Cachi', 'Salta')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- San Juan
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('San Juan Capital', 'San Juan'),
             ('Rawson', 'San Juan'),
             ('Rivadavia', 'San Juan'),
             ('Chimbas', 'San Juan'),
             ('Santa Lucía', 'San Juan'),
             ('Caucete', 'San Juan'),
             ('San José de Jáchal', 'San Juan'),
             ('Villa Krause', 'San Juan'),
             ('Barreal', 'San Juan'),
             ('Media Agua', 'San Juan')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- San Luis
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('San Luis Capital', 'San Luis'),
             ('Villa Mercedes', 'San Luis'),
             ('Merlo', 'San Luis'),
             ('Juana Koslay', 'San Luis'),
             ('La Punta', 'San Luis'),
             ('Justo Daract', 'San Luis'),
             ('Tilisarao', 'San Luis'),
             ('Quines', 'San Luis'),
             ('Potrero de los Funes', 'San Luis'),
             ('Concarán', 'San Luis')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Santa Cruz
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Río Gallegos', 'Santa Cruz'),
             ('El Calafate', 'Santa Cruz'),
             ('Caleta Olivia', 'Santa Cruz'),
             ('Puerto Deseado', 'Santa Cruz'),
             ('Pico Truncado', 'Santa Cruz'),
             ('Las Heras', 'Santa Cruz'),
             ('Puerto San Julián', 'Santa Cruz'),
             ('El Chaltén', 'Santa Cruz'),
             ('Río Turbio', 'Santa Cruz'),
             ('Puerto Santa Cruz', 'Santa Cruz')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Santa Fe
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Rosario', 'Santa Fe'),
             ('Santa Fe capital', 'Santa Fe'),
             ('Rafaela', 'Santa Fe'),
             ('Venado Tuerto', 'Santa Fe'),
             ('Reconquista', 'Santa Fe'),
             ('Santo Tomé', 'Santa Fe'),
             ('Villa Constitución', 'Santa Fe'),
             ('Esperanza', 'Santa Fe'),
             ('Sunchales', 'Santa Fe'),
             ('San Lorenzo', 'Santa Fe')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Santiago del Estero
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Santiago del Estero Capital', 'Santiago del Estero'),
             ('La Banda', 'Santiago del Estero'),
             ('Termas de Río Hondo', 'Santiago del Estero'),
             ('Añatuya', 'Santiago del Estero'),
             ('Frías', 'Santiago del Estero'),
             ('Quimillí', 'Santiago del Estero'),
             ('Fernández', 'Santiago del Estero'),
             ('Monte Quemado', 'Santiago del Estero'),
             ('Loreto', 'Santiago del Estero'),
             ('Suncho Corral', 'Santiago del Estero')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Tierra del Fuego
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Ushuaia', 'Tierra del Fuego'),
             ('Río Grande', 'Tierra del Fuego'),
             ('Tolhuin', 'Tierra del Fuego'),
             ('Puerto Almanza', 'Tierra del Fuego'),
             ('San Sebastián', 'Tierra del Fuego'),
             ('Lago Escondido', 'Tierra del Fuego'),
             ('Sarmiento', 'Tierra del Fuego'),
             ('Paso Garibaldi', 'Tierra del Fuego'),
             ('Puerto Cook', 'Tierra del Fuego'),
             ('Base Esperanza', 'Tierra del Fuego')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Argentina- Tucumán
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('San Miguel de Tucumán', 'Tucumán'),
             ('Yerba Buena', 'Tucumán'),
             ('Concepción', 'Tucumán'),
             ('Tafí del Valle', 'Tucumán'),
             ('Tafí Viejo', 'Tucumán'),
             ('Aguilares', 'Tucumán'),
             ('Monteros', 'Tucumán'),
             ('Lules', 'Tucumán'),
             ('Famaillá', 'Tucumán'),
             ('Trancas', 'Tucumán')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Brasil- São Paulo
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('São Paulo Capital', 'São Paulo'),
             ('Campinas', 'São Paulo'),
             ('Guarulhos', 'São Paulo'),
             ('Santos', 'São Paulo'),
             ('Ribeirão Preto', 'São Paulo')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Brasil- Rio de Janeiro
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Río de Janeiro Capital', 'Río de Janeiro'),
             ('Niterói', 'Río de Janeiro'),
             ('Búzios', 'Río de Janeiro'),
             ('Petrópolis', 'Río de Janeiro'),
             ('Duque de Caxias', 'Río de Janeiro')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Brasil- Minas Gerais
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Belo Horizonte', 'Minas Gerais'),
             ('Ouro Preto', 'Minas Gerais'),
             ('Uberlândia', 'Minas Gerais'),
             ('Tiradentes', 'Minas Gerais'),
             ('Juiz de Fora', 'Minas Gerais')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Brasil- Distrito Federal
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Brasilia', 'Distrito Federal'),
             ('Taguatinga', 'Distrito Federal'),
             ('Ceilândia', 'Distrito Federal'),
             ('Águas Claras', 'Distrito Federal'),
             ('Gama', 'Distrito Federal')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Brasil- Bahía
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Salvador', 'Bahía'),
             ('Feira de Santana', 'Bahía'),
             ('Porto Seguro', 'Bahía'),
             ('Ilhéus', 'Bahía'),
             ('Vitória de Conquista', 'Bahía')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;



-- =========================
-- Paraguay- Asunción
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Villa Morra', 'Asunción'),
             ('Sajonia', 'Asunción'),
             ('Barrio Obrero', 'Asunción'),
             ('Las Lomas', 'Asunción'),
             ('La Encarnación', 'Asunción')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Paraguay- Central
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Luque', 'Central'),
             ('San Lorenzo', 'Central'),
             ('Lambaré', 'Central'),
             ('Mariano Roque Alonso', 'Central'),
             ('Capiatá', 'Central')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Paraguay- Alto Paraná
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Ciudad del Este', 'Alto Paraná'),
             ('Presidente Franco', 'Alto Paraná'),
             ('Hernandarias', 'Alto Paraná'),
             ('Minga Guazú', 'Alto Paraná'),
             ('Santa Rita', 'Alto Paraná')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Paraguay- Itapúa
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Encarnación', 'Itapúa'),
             ('Hohenau', 'Itapúa'),
             ('Bella Vista', 'Itapúa'),
             ('Carmen del Paraná', 'Itapúa'),
             ('San Cosme y Damián', 'Itapúa')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Paraguay- Cordillera
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Caacupé', 'Cordillera'),
             ('Piribebuy', 'Cordillera'),
             ('San Bernardino', 'Cordillera'),
             ('Altos', 'Cordillera'),
             ('Tobatí', 'Cordillera')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Uruguay- Montevideo
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Ciudad Vieja', 'Montevideo'),
             ('Pocítos', 'Montevideo'),
             ('Carrasco', 'Montevideo'),
             ('Prado', 'Montevideo'),
             ('Cerro', 'Montevideo')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Uruguay- Canelones
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Canelones Capital', 'Canelones'),
             ('Ciudad de la Costa', 'Canelones'),
             ('Las Piedras', 'Canelones'),
             ('Pando', 'Canelones'),
             ('Atlántida', 'Canelones')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Uruguay- Maldonado
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Maldonado Capital', 'Maldonado'),
             ('Punta del Este', 'Maldonado'),
             ('Piriápolis', 'Maldonado'),
             ('San Carlos', 'Maldonado'),
             ('Punta Ballena', 'Maldonado')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Uruguay- Colonia
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Colonia del Sacramento', 'Colonia'),
             ('Carmelo', 'Colonia'),
             ('Nueva Helvecia', 'Colonia'),
             ('Juan Lacaze', 'Colonia'),
             ('Rosario', 'Colonia')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Uruguay- Salto
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Salto Capital', 'Salto'),
             ('Termas del Daymán', 'Salto'),
             ('Constitución', 'Salto'),
             ('Belén', 'Salto'),
             ('Termas del Arapey', 'Salto')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Chile- Región Metropolitana
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Santiago', 'Región Metropolitana'),
             ('Las Condes', 'Región Metropolitana'),
             ('Puente Alto', 'Región Metropolitana'),
             ('Maipú', 'Región Metropolitana'),
             ('Providencia', 'Región Metropolitana')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Chile- Valparaíso
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Valparaiso Capital', 'Valparaíso'),
             ('Viña de Mar', 'Valparaíso'),
             ('San Antonio', 'Valparaíso'),
             ('Quillota', 'Valparaíso'),
             ('Los Andes', 'Valparaíso')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Chile- Biobío
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Concepción', 'Biobío'),
             ('Talcahuano', 'Biobío'),
             ('Los Ángeles', 'Biobío'),
             ('Coronel', 'Biobío'),
             ('Chiguayante', 'Biobío')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Chile- Antofagasta
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('Antofagasta', 'Antofagasta'),
             ('Calama', 'Antofagasta'),
             ('San Pedro de Atacama', 'Antofagasta'),
             ('Tocopilla', 'Antofagasta'),
             ('Mejillones', 'Antofagasta')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;

-- =========================
-- Chile- Coquimbo
-- =========================

INSERT INTO cities (name, province_id)
SELECT
    city.name,
    p.id
FROM (
         VALUES
             ('La Serena', 'Coquimbo'),
             ('Coquimbo', 'Coquimbo'),
             ('Ovalle', 'Coquimbo'),
             ('Illapel', 'Coquimbo'),
             ('Vicuña', 'Coquimbo')
     ) AS city(name, province_name)
         JOIN provinces p
              ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;


