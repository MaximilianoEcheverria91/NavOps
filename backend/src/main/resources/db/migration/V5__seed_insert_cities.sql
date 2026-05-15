INSERT INTO cities (id, name, province_id, version) -- Agregamos id y version
SELECT
    gen_random_uuid(), -- Genera el UUID para la ciudad
    city.name,
    p.id,
    0                  -- Inicializa la versión en 0 para Hibernate
FROM (
         VALUES
            -- Buenos Aires

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
            ('San Antonio de Areco', 'Buenos Aires'),

            -- Ciudad de Buenos Aires

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
            ('Mataderos', 'Ciudad Autónoma de Buenos Aires'),

            -- Gran Buenos Aires

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
            ('Virrey del Pino', 'Gran Buenos Aires'),

            -- Catamarca

            ('San Fernando del Valle de Catamarca', 'Catamarca'),
            ('Valle Viejo', 'Catamarca'),
            ('Belén', 'Catamarca'),
            ('Andalgalá', 'Catamarca'),
            ('Tinogasta', 'Catamarca'),
            ('Fiambalá', 'Catamarca'),
            ('Santa María', 'Catamarca'),
            ('Recreo', 'Catamarca'),
            ('Saujil', 'Catamarca'),
            ('San José', 'Catamarca'),

            -- Chaco

            ('Resistencia', 'Chaco'),
            ('Presidencia Roque Sáenz Peña', 'Chaco'),
            ('Villa Ángela', 'Chaco'),
            ('Charata', 'Chaco'),
            ('General José de San Martín', 'Chaco'),
            ('Juan José Castelli', 'Chaco'),
            ('Quitilipi', 'Chaco'),
            ('Las Breñas', 'Chaco'),
            ('Barranqueras', 'Chaco'),
            ('Fontana', 'Chaco'),

            -- Chubut

            ('Rawson', 'Chubut'),
            ('Comodoro Rivadavia', 'Chubut'),
            ('Trelew', 'Chubut'),
            ('Puerto Madryn', 'Chubut'),
            ('Esquel', 'Chubut'),
            ('Sarmiento', 'Chubut'),
            ('Gaiman', 'Chubut'),
            ('El Maitén', 'Chubut'),
            ('Rada Tilly', 'Chubut'),
            ('Lago Puelo', 'Chubut'),

            -- Córdoba

            ('Córdoba Capital', 'Córdoba'),
            ('Villa Carlos Paz', 'Córdoba'),
            ('Río Cuarto', 'Córdoba'),
            ('Villa María', 'Córdoba'),
            ('San Francisco', 'Córdoba'),
            ('Alta Gracia', 'Córdoba'),
            ('Jesús María', 'Córdoba'),
            ('Río Tercero', 'Córdoba'),
            ('Bell Ville', 'Córdoba'),
            ('Villa General Belgrano', 'Córdoba'),

            -- Corrientes

            ('Corrientes Capital', 'Corrientes'),
            ('Goya', 'Corrientes'),
            ('Paso de los Libres', 'Corrientes'),
            ('Curuzú Cuatiá', 'Corrientes'),
            ('Mercedes', 'Corrientes'),
            ('Bella Vista', 'Corrientes'),
            ('Santo Tomé', 'Corrientes'),
            ('Monte Caseros', 'Corrientes'),
            ('Ituzaingó', 'Corrientes'),
            ('Esquina', 'Corrientes'),

            -- Entre Ríos

            ('Paraná', 'Entre Ríos'),
            ('Concordia', 'Entre Ríos'),
            ('Gualeguaychú', 'Entre Ríos'),
            ('Concepción del Uruguay', 'Entre Ríos'),
            ('Federación', 'Entre Ríos'),
            ('Villaguay', 'Entre Ríos'),
            ('Chajarí', 'Entre Ríos'),
            ('Victoria', 'Entre Ríos'),
            ('Colón', 'Entre Ríos'),
            ('Nogoyá', 'Entre Ríos'),

            -- Formosa

            ('Formosa Capital', 'Formosa'),
            ('Clorinda', 'Formosa'),
            ('Pirané', 'Formosa'),
            ('EL Colorado', 'Formosa'),
            ('Las Lomitas', 'Formosa'),
            ('Ibarreta', 'Formosa'),
            ('Ingeniero Juárez', 'Formosa'),
            ('Espinillo', 'Formosa'),
            ('Laguna Blanca', 'Formosa'),
            ('Comandante Fontana', 'Formosa'),

            -- Jujuy

            ('San Salvador de Jujuy', 'Jujuy'),
            ('San Pedro de Jujuy', 'Jujuy'),
            ('Libertador General San Martín:', 'Jujuy'),
            ('Perico', 'Jujuy'),
            ('Palpalá', 'Jujuy'),
            ('Humahuaca', 'Jujuy'),
            ('Tilcara', 'Jujuy'),
            ('La Quiaca', 'Jujuy'),
            ('Abra Pampa', 'Jujuy'),
            ('Purmamarca', 'Jujuy'),

            -- La Pampa

            ('Santa rosa', 'La Pampa'),
            ('General Pico', 'La Pampa'),
            ('General Acha', 'La Pampa'),
            ('Eduardo Castex', 'La Pampa'),
            ('Toay', 'La Pampa'),
            ('Realicó', 'La Pampa'),
            ('Victorica', 'La Pampa'),
            ('25 de Mayo', 'La Pampa'),
            ('Intendente Alvear', 'La Pampa'),
            ('Guatraché', 'La Pampa'),

            -- La Rioja

            ('La Rioja Capital', 'La Rioja'),
            ('Chilecito', 'La Rioja'),
            ('Aimogasta', 'La Rioja'),
            ('Villa Unión', 'La Rioja'),
            ('Chamical', 'La Rioja'),
            ('Chepes', 'La Rioja'),
            ('Famatina', 'La Rioja'),
            ('Vinchina', 'La Rioja'),
            ('Anillaco', 'La Rioja'),
            ('Olta', 'La Rioja'),

            -- Mendoza

            ('Mendoza Capital', 'Mendoza'),
            ('San Rafael', 'Mendoza'),
            ('Godoy Cruz', 'Mendoza'),
            ('Guaymallén', 'Mendoza'),
            ('Luján de Cuyo', 'Mendoza'),
            ('Maipú', 'Mendoza'),
            ('Tunuyán', 'Mendoza'),
            ('Malargüe', 'Mendoza'),
            ('General Alvear', 'Mendoza'),
            ('Rivadavia', 'Mendoza'),

            -- Misiones

            ('Posada', 'Misiones'),
            ('Puerto Iguazú', 'Misiones'),
            ('Oberá', 'Misiones'),
            ('Eldorado', 'Misiones'),
            ('Apóstoles', 'Misiones'),
            ('San Vicente', 'Misiones'),
            ('Jardín América', 'Misiones'),
            ('Puerto Rico', 'Misiones'),
            ('Montecarlo', 'Misiones'),
            ('San Ignacio', 'Misiones'),

            -- Neuquen

            ('Neuquén Capital', 'Neuquén'),
            ('San Martin de los Andes', 'Neuquén'),
            ('Añelo', 'Neuquén'),
            ('Cutral Có', 'Neuquén'),
            ('Zapata', 'Neuquén'),
            ('Villa La Angostura', 'Neuquén'),
            ('Centenario', 'Neuquén'),
            ('Plottier', 'Neuquén'),
            ('Chos Malal', 'Neuquén'),
            ('Junín de los Andes', 'Neuquén'),

            -- Río Negro

            ('Viedma', 'Río Negro'),
            ('San Carlos de Bariloche', 'Río Negro'),
            ('General Roca', 'Río Negro'),
            ('Cipolletti', 'Río Negro'),
            ('Las Grutas', 'Río Negro'),
            ('San Antonio Oeste', 'Río Negro'),
            ('Villa Regina', 'Río Negro'),
            ('El Bolsón', 'Río Negro'),
            ('Cinco Saltos', 'Río Negro'),
            ('Catriel', 'Río Negro'),

            -- Salta

            ('Salta Capital', 'Salta'),
            ('San Ramón de la Nueva Orán', 'Salta'),
            ('Tartagal', 'Salta'),
            ('Cafayate', 'Salta'),
            ('General Güemes', 'Salta'),
            ('San José de Metán', 'Salta'),
            ('Rosario de la Frontera', 'Salta'),
            ('Pichanal', 'Salta'),
            ('Embarcación', 'Salta'),
            ('Cachi', 'Salta'),

            -- San Juan

            ('San Juan Capital', 'San Juan'),
            ('Rawson', 'San Juan'),
            ('Rivadavia', 'San Juan'),
            ('Chimbas', 'San Juan'),
            ('Santa Lucía', 'San Juan'),
            ('Caucete', 'San Juan'),
            ('San José de Jáchal', 'San Juan'),
            ('Villa Krause', 'San Juan'),
            ('Barreal', 'San Juan'),
            ('Media Agua', 'San Juan'),

            -- San Luis

            ('San Luis Capital', 'San Luis'),
            ('Villa Mercedes', 'San Luis'),
            ('Merlo', 'San Luis'),
            ('Juana Koslay', 'San Luis'),
            ('La Punta', 'San Luis'),
            ('Justo Daract', 'San Luis'),
            ('Tilisarao', 'San Luis'),
            ('Quines', 'San Luis'),
            ('Potrero de los Funes', 'San Luis'),
            ('Concarán', 'San Luis'),

            -- Santa Cruz

            ('Río Gallegos', 'Santa Cruz'),
            ('El Calafate', 'Santa Cruz'),
            ('Caleta Olivia', 'Santa Cruz'),
            ('Puerto Deseado', 'Santa Cruz'),
            ('Pico Truncado', 'Santa Cruz'),
            ('Las Heras', 'Santa Cruz'),
            ('Puerto San Julián', 'Santa Cruz'),
            ('El Chaltén', 'Santa Cruz'),
            ('Río Turbio', 'Santa Cruz'),
            ('Puerto Santa Cruz', 'Santa Cruz'),

            -- Santa Fe

            ('Rosario', 'Santa Fe'),
            ('Santa Fe capital', 'Santa Fe'),
            ('Rafaela', 'Santa Fe'),
            ('Venado Tuerto', 'Santa Fe'),
            ('Reconquista', 'Santa Fe'),
            ('Santo Tomé', 'Santa Fe'),
            ('Villa Constitución', 'Santa Fe'),
            ('Esperanza', 'Santa Fe'),
            ('Sunchales', 'Santa Fe'),
            ('San Lorenzo', 'Santa Fe'),

            -- Santiago del Estero

            ('Santiago del Estero Capital', 'Santiago del Estero'),
            ('La Banda', 'Santiago del Estero'),
            ('Termas de Río Hondo', 'Santiago del Estero'),
            ('Añatuya', 'Santiago del Estero'),
            ('Frías', 'Santiago del Estero'),
            ('Quimillí', 'Santiago del Estero'),
            ('Fernández', 'Santiago del Estero'),
            ('Monte Quemado', 'Santiago del Estero'),
            ('Loreto', 'Santiago del Estero'),
            ('Suncho Corral', 'Santiago del Estero'),

            -- Tierra del Fuego

            ('Ushuaia', 'Tierra del Fuego'),
            ('Río Grande', 'Tierra del Fuego'),
            ('Tolhuin', 'Tierra del Fuego'),
            ('Puerto Almanza', 'Tierra del Fuego'),
            ('San Sebastián', 'Tierra del Fuego'),
            ('Lago Escondido', 'Tierra del Fuego'),
            ('Sarmiento', 'Tierra del Fuego'),
            ('Paso Garibaldi', 'Tierra del Fuego'),
            ('Puerto Cook', 'Tierra del Fuego'),
            ('Base Esperanza', 'Tierra del Fuego'),

            -- Tucuman

            ('San Miguel de Tucumán', 'Tucumán'),
            ('Yerba Buena', 'Tucumán'),
            ('Concepción', 'Tucumán'),
            ('Tafí del Valle', 'Tucumán'),
            ('Tafí Viejo', 'Tucumán'),
            ('Aguilares', 'Tucumán'),
            ('Monteros', 'Tucumán'),
            ('Lules', 'Tucumán'),
            ('Famaillá', 'Tucumán'),
            ('Trancas', 'Tucumán'),

            -- Brasil - São Paulo

            ('São Paulo Capital', 'São Paulo'),
            ('Campinas', 'São Paulo'),
            ('Guarulhos', 'São Paulo'),
            ('Santos', 'São Paulo'),
            ('Ribeirão Preto', 'São Paulo'),

            -- Brasil - Río de Janeiro

            ('Río de Janeiro Capital', 'Río de Janeiro'),
            ('Niterói', 'Río de Janeiro'),
            ('Búzios', 'Río de Janeiro'),
            ('Petrópolis', 'Río de Janeiro'),
            ('Duque de Caxias', 'Río de Janeiro'),

            -- Brasil - Minas Gerais

            ('Belo Horizonte', 'Minas Gerais'),
            ('Ouro Preto', 'Minas Gerais'),
            ('Uberlândia', 'Minas Gerais'),
            ('Tiradentes', 'Minas Gerais'),
            ('Juiz de Fora', 'Minas Gerais'),

            -- Brasil - Distrito Federal

            ('Brasilia', 'Distrito Federal'),
            ('Taguatinga', 'Distrito Federal'),
            ('Ceilândia', 'Distrito Federal'),
            ('Águas Claras', 'Distrito Federal'),
            ('Gama', 'Distrito Federal'),

            -- Brasil - Bahía

            ('Salvador', 'Bahía'),
            ('Feira de Santana', 'Bahía'),
            ('Porto Seguro', 'Bahía'),
            ('Ilhéus', 'Bahía'),
            ('Vitória de Conquista', 'Bahía'),

            -- Paraguay - Asunción

            ('Villa Morra', 'Asunción'),
            ('Sajonia', 'Asunción'),
            ('Barrio Obrero', 'Asunción'),
            ('Las Lomas', 'Asunción'),
            ('La Encarnación', 'Asunción'),

            -- Paraguay - Central

            ('Luque', 'Central'),
            ('San Lorenzo', 'Central'),
            ('Lambaré', 'Central'),
            ('Mariano Roque Alonso', 'Central'),
            ('Capiatá', 'Central'),

            -- Paraguay - Alto Parana

            ('Ciudad del Este', 'Alto Paraná'),
            ('Presidente Franco', 'Alto Paraná'),
            ('Hernandarias', 'Alto Paraná'),
            ('Minga Guazú', 'Alto Paraná'),
            ('Santa Rita', 'Alto Paraná'),

            -- Paraguay Itapúa

            ('Encarnación', 'Itapúa'),
            ('Hohenau', 'Itapúa'),
            ('Bella Vista', 'Itapúa'),
            ('Carmen del Paraná', 'Itapúa'),
            ('San Cosme y Damián', 'Itapúa'),

            -- Paraguay - Cordillera

            ('Caacupé', 'Cordillera'),
            ('Piribebuy', 'Cordillera'),
            ('San Bernardino', 'Cordillera'),
            ('Altos', 'Cordillera'),
            ('Tobatí', 'Cordillera'),

            -- Uruguay - Montevideo

            ('Ciudad Vieja', 'Montevideo'),
            ('Pocítos', 'Montevideo'),
            ('Carrasco', 'Montevideo'),
            ('Prado', 'Montevideo'),
            ('Cerro', 'Montevideo'),

            -- Uruguay - Canelones

            ('Canelones Capital', 'Canelones'),
            ('Ciudad de la Costa', 'Canelones'),
            ('Las Piedras', 'Canelones'),
            ('Pando', 'Canelones'),
            ('Atlántida', 'Canelones'),

            -- Uruguay - Maldonado

            ('Maldonado Capital', 'Maldonado'),
            ('Punta del Este', 'Maldonado'),
            ('Piriápolis', 'Maldonado'),
            ('San Carlos', 'Maldonado'),
            ('Punta Ballena', 'Maldonado'),

            -- Uruguay - Colonia

            ('Colonia del Sacramento', 'Colonia'),
            ('Carmelo', 'Colonia'),
            ('Nueva Helvecia', 'Colonia'),
            ('Juan Lacaze', 'Colonia'),
            ('Rosario', 'Colonia'),

            --Uruguay - Salto

            ('Salto Capital', 'Salto'),
            ('Termas del Daymán', 'Salto'),
            ('Constitución', 'Salto'),
            ('Belén', 'Salto'),
            ('Termas del Arapey', 'Salto'),

            -- Chile - Región Metropolitana

            ('Santiago', 'Región Metropolitana'),
            ('Las Condes', 'Región Metropolitana'),
            ('Puente Alto', 'Región Metropolitana'),
            ('Maipú', 'Región Metropolitana'),
            ('Providencia', 'Región Metropolitana'),

            -- Chile - Valparaiso

            ('Valparaiso Capital', 'Valparaíso'),
            ('Viña de Mar', 'Valparaíso'),
            ('San Antonio', 'Valparaíso'),
            ('Quillota', 'Valparaíso'),
            ('Los Andes', 'Valparaíso'),

            -- Chile - Bohío

            ('Concepción', 'Biobío'),
            ('Talcahuano', 'Biobío'),
            ('Los Ángeles', 'Biobío'),
            ('Coronel', 'Biobío'),
            ('Chiguayante', 'Biobío'),

            -- Chile - Antofagasta

            ('Antofagasta', 'Antofagasta'),
            ('Calama', 'Antofagasta'),
            ('San Pedro de Atacama', 'Antofagasta'),
            ('Tocopilla', 'Antofagasta'),
            ('Mejillones', 'Antofagasta'),

            -- Chile - Coquimbo

            ('La Serena', 'Coquimbo'),
            ('Coquimbo', 'Coquimbo'),
            ('Ovalle', 'Coquimbo'),
            ('Illapel', 'Coquimbo'),
            ('Vicuña', 'Coquimbo')

     ) AS city(name, province_name)
         JOIN provinces p ON p.name = city.province_name
    ON CONFLICT (name, province_id) DO NOTHING;