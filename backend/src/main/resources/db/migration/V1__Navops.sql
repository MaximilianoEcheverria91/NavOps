-- ==========================================================
-- SCRIPT DE BASE DE DATOS - NAVOPS ARCHITECTURE v1.1 (MVP)
-- Optimizada para Sincronizaci�n Offline (PWA / Dexie.js)
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Funci�n maestra de automatizaci�n de actualizaciones (Vital para motor offline)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. CAT�LOGOS BASE
CREATE TABLE countries (
                           id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                           country_name varchar(100) NOT NULL,
                           iso_code varchar(2) NOT NULL UNIQUE,
                           version integer NOT NULL DEFAULT 0,
                           created_at timestamp with time zone DEFAULT now(),
                           updated_at timestamp with time zone DEFAULT now(),
                           deleted_at timestamp with time zone
);

CREATE TABLE provinces (
                           id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                           name varchar(100) NOT NULL,
                           country_id uuid NOT NULL REFERENCES countries(id),
                           UNIQUE(name,country_id),
                           version integer NOT NULL DEFAULT 0,
                           created_at timestamp with time zone DEFAULT now(),
                           updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE cities (
                        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                        name varchar(100) NOT NULL,
                        province_id uuid NOT NULL REFERENCES provinces(id),
                        version integer NOT NULL DEFAULT 0,
                        created_at timestamp with time zone DEFAULT now(),
                        updated_at timestamp with time zone DEFAULT now(),
                        UNIQUE(name, province_id)
);

CREATE TABLE roles (
                       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                       name varchar(100) NOT NULL UNIQUE,
                       description varchar(255),
                       version integer NOT NULL DEFAULT 0,
                       created_at timestamp with time zone DEFAULT now(),
                       updated_at timestamp with time zone DEFAULT now(),
                       deleted_at timestamp with time zone
);

CREATE TABLE cargo_type (
                            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                            name varchar(80) NOT NULL UNIQUE,
                            description text,
                            version integer NOT NULL DEFAULT 0,
                            created_at timestamp with time zone DEFAULT now(),
                            updated_at timestamp with time zone DEFAULT now(),
                            deleted_at timestamp with time zone
);

-- 2. USUARIOS Y SISTEMA
CREATE TABLE users (
                       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                       username varchar(50) NOT NULL UNIQUE,
                       email varchar(150) UNIQUE,
                       password_hash varchar(255) NOT NULL,
                       is_active boolean NOT NULL DEFAULT true,
                       is_blocked boolean DEFAULT false,
                       role_id uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
                       version integer NOT NULL DEFAULT 0,
                       created_at timestamp with time zone DEFAULT now(),
                       updated_at timestamp with time zone DEFAULT now(),
                       deleted_at timestamp with time zone
);

CREATE TABLE system_attachments (
                                    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                    entity_type varchar(50) NOT NULL,
                                    entity_id uuid NOT NULL,
                                    file_url varchar(1000) NOT NULL,
                                    file_type varchar(50),
                                    description text,
                                    uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
                                    version integer NOT NULL DEFAULT 0,
                                    created_at timestamp with time zone DEFAULT now(),
                                    updated_at timestamp with time zone DEFAULT now(),
                                    deleted_at timestamp with time zone
);

CREATE TABLE login_attempts (
                                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                username varchar(50) NOT NULL,
                                ip_address varchar(45) NOT NULL,
                                success boolean NOT NULL,
                                attempt_time timestamp with time zone NOT NULL DEFAULT now(),
                                version integer NOT NULL DEFAULT 0,
                                created_at timestamp with time zone DEFAULT now(),
                                updated_at timestamp with time zone DEFAULT now(),
                                deleted_at timestamp with time zone
);

CREATE TABLE password_reset_codes (
                                      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                      code varchar(20) NOT NULL,
                                      expires_at timestamp with time zone NOT NULL,
                                      used boolean NOT NULL DEFAULT false,
                                      version integer NOT NULL DEFAULT 0,
                                      created_at timestamp with time zone DEFAULT now(),
                                      updated_at timestamp with time zone DEFAULT now(),
                                      deleted_at timestamp with time zone
);

-- 3. PERSONAL (PEOPLE y CREW)
CREATE TABLE people (
                        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                        full_name varchar(200) NOT NULL,
                        surname varchar(150) NOT NULL,
                        document_type varchar(50) NOT NULL,
                        document_number varchar(60) NOT NULL,
                        cuil varchar(50),
                        nationality_country_id uuid REFERENCES countries(id),
                        marital_status varchar(50),
                        gender varchar(20) NOT NULL,
                        birth_date date NOT NULL,
                        country_id uuid NOT NULL REFERENCES countries(id),
                        email varchar(255),
                        mobile varchar(50),
                        home_phone varchar(50),
                        address_street varchar(200),
                        address_number varchar(20),
                        address_floor varchar(10),
                        address_department varchar(20),
                        city_id uuid REFERENCES cities(id),
                        province_id uuid REFERENCES provinces(id),
                        address_postal_code varchar(20),
                        status varchar(50) DEFAULT 'ACTIVE',
                        avatar_url varchar(1000),
                        user_id uuid UNIQUE REFERENCES users(id) ON DELETE SET NULL,
                        version integer NOT NULL DEFAULT 0,
                        created_at timestamp with time zone DEFAULT now(),
                        updated_at timestamp with time zone DEFAULT now(),
                        deleted_at timestamp with time zone
);

CREATE TABLE crew_members (
                              id uuid PRIMARY KEY REFERENCES people(id),
                              file_number varchar(50) NOT NULL UNIQUE,
                              maritime_book_number varchar(80) NOT NULL UNIQUE,
                              navigation_role varchar(100) NOT NULL,
                              category varchar(80) NOT NULL,
                              hire_date date NOT NULL,
                              current_status varchar(50) NOT NULL DEFAULT 'AVAILABLE',
                              version integer NOT NULL DEFAULT 0,
                              created_at timestamp with time zone DEFAULT now(),
                              updated_at timestamp with time zone DEFAULT now(),
                              deleted_at timestamp with time zone
);

-- 4. FLOTA MAR�TIMA
CREATE TABLE ships (
                       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                       name varchar(150) NOT NULL,
                       registration varchar(100) NOT NULL UNIQUE,
                       imo_number varchar(50) NOT NULL UNIQUE,
                       ship_type varchar(80) NOT NULL,
                       length numeric(8,2) NOT NULL,
                       beam numeric(8,2) NOT NULL,
                       draft numeric(8,2) NOT NULL,
                       depth numeric(8,2) NOT NULL,
                       weight_tonnes numeric(10,2) NOT NULL,
                       cargo_capacity_tonnes numeric(10,2) NOT NULL,
                       crew_capacity smallint NOT NULL,
                       build_year smallint NOT NULL,
                       country_id uuid REFERENCES countries(id) ON DELETE SET NULL,
                       main_image_url varchar(1000),
                       version integer NOT NULL DEFAULT 0,
                       created_at timestamp with time zone DEFAULT now(),
                       updated_at timestamp with time zone DEFAULT now(),
                       deleted_at timestamp with time zone
);

CREATE TABLE engines (
                         id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                         ship_id uuid NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
                         manufacturer varchar(100) NOT NULL,
                         model varchar(100) NOT NULL,
                         power_hp int NOT NULL,
                         engine_type varchar(50) NOT NULL,
                         current_engine_hours int NOT NULL DEFAULT 0,
                         version integer NOT NULL DEFAULT 0,
                         created_at timestamp with time zone DEFAULT now(),
                         updated_at timestamp with time zone DEFAULT now(),
                         deleted_at timestamp with time zone
);

CREATE TABLE tbo (
                     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                     engine_id uuid NOT NULL REFERENCES engines(id) ON DELETE CASCADE,
                     hours_to_tbo int NOT NULL,
                     last_tbo_date date NOT NULL,
                     next_tbo_date date NOT NULL,
                     alert_status varchar(50) NOT NULL,
                     version integer NOT NULL DEFAULT 0,
                     created_at timestamp with time zone DEFAULT now(),
                     updated_at timestamp with time zone DEFAULT now(),
                     deleted_at timestamp with time zone
);

CREATE TABLE ship_tanks (
                            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                            ship_id uuid NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
                            tank_name varchar(50) NOT NULL,
                            content_type varchar(50) NOT NULL,
                            max_capacity_liters numeric(12,2) NOT NULL,
                            version integer NOT NULL DEFAULT 0,
                            created_at timestamp with time zone DEFAULT now(),
                            updated_at timestamp with time zone DEFAULT now(),
                            deleted_at timestamp with time zone
);

CREATE TABLE maintenance (
                             id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                             ship_id uuid NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
                             maintenance_type varchar(50) NOT NULL,
                             description text,
                             scheduled_date date NOT NULL,
                             completed_date date,
                             status varchar(50) NOT NULL DEFAULT 'SCHEDULED',
                             cost numeric(14,2),
                             created_by uuid REFERENCES users(id) ON DELETE SET NULL,
                             version integer NOT NULL DEFAULT 0,
                             created_at timestamp with time zone DEFAULT now(),
                             updated_at timestamp with time zone DEFAULT now(),
                             deleted_at timestamp with time zone
);

-- 5. OPERACIONES Y NAVEGACI�N
CREATE TABLE ports (
                       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                       name varchar(200) NOT NULL,
                       port_type varchar(80),
                       dock_type varchar(80),
                       code varchar(10),
                       latitude double precision NOT NULL,
                       longitude double precision NOT NULL,
                       dock_count smallint,
                       max_length numeric(8,2),
                       max_draft numeric(8,2),
                       country_id uuid REFERENCES countries(id),
                       province_id uuid REFERENCES provinces(id),
                       city_id uuid REFERENCES cities(id),
                       contact_email varchar(50),
                       contact_phone varchar(50),
                       contact_web varchar(250),
                       timezone varchar(50),
                       status varchar(50),
                       is_active boolean DEFAULT true,
                       main_image_url varchar(1000),
                       version integer NOT NULL DEFAULT 0,
                       created_at timestamp with time zone DEFAULT now(),
                       updated_at timestamp with time zone DEFAULT now(),
                       deleted_at timestamp with time zone

);

CREATE TABLE travel_plan (
                             id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                             ship_id uuid NOT NULL REFERENCES ships(id) ON DELETE RESTRICT,
                             origin_port_id uuid NOT NULL REFERENCES ports(id) ON DELETE RESTRICT,
                             destination_port_id uuid NOT NULL REFERENCES ports(id) ON DELETE RESTRICT,
                             departure_time timestamp with time zone NOT NULL,
                             eta timestamp with time zone NOT NULL,
                             distance_miles numeric(10,2),
                             estimated_hours numeric(8,2),
                             status varchar(50) NOT NULL DEFAULT 'PLANNED',
                             progress_percentage numeric(5,2) DEFAULT 0.00,
                             delay_hours numeric(6,2) DEFAULT 0.00,
                             total_cargo_tonnes numeric(12,2) DEFAULT 0.00,
                             version integer NOT NULL DEFAULT 0,
                             created_at timestamp with time zone DEFAULT now(),
                             updated_at timestamp with time zone DEFAULT now(),
                             deleted_at timestamp with time zone
);

CREATE TABLE stop (
                      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                      plan_id uuid NOT NULL REFERENCES travel_plan(id) ON DELETE CASCADE,
                      port_id uuid NOT NULL REFERENCES ports(id) ON DELETE RESTRICT,
                      sequence smallint NOT NULL,
                      est_boarding_time timestamp with time zone,
                      est_disembark_time timestamp with time zone,
                      version integer NOT NULL DEFAULT 0,
                      created_at timestamp with time zone DEFAULT now(),
                      updated_at timestamp with time zone DEFAULT now(),
                      deleted_at timestamp with time zone,
                      UNIQUE (plan_id, sequence)
);

CREATE TABLE travel_plan_crew (
                                  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                  plan_id uuid NOT NULL REFERENCES travel_plan(id),
                                  crew_member_id uuid NOT NULL REFERENCES crew_members(id),
                                  role varchar(100),
                                  version integer NOT NULL DEFAULT 0,
                                  created_at timestamp with time zone DEFAULT now(),
                                  updated_at timestamp with time zone DEFAULT now(),
                                  deleted_at timestamp with time zone,
                                  UNIQUE(plan_id, crew_member_id)
);

-- 6. CARGA Y LOG�STICA
CREATE TABLE cargo_unit (
                            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                            ship_id uuid NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
                            travel_plan_id uuid REFERENCES travel_plan(id) ON DELETE SET NULL,
                            cargo_type_id uuid NOT NULL REFERENCES cargo_type(id) ON DELETE RESTRICT,
                            unit_code varchar(100) NOT NULL UNIQUE,
                            owning_company varchar(200) NOT NULL,
                            length numeric(8,2) NOT NULL,
                            width numeric(8,2) NOT NULL,
                            height numeric(8,2) NOT NULL,
                            weight_tonnes numeric(10,2) NOT NULL,
                            container_type varchar(80),
                            hazardous_material boolean NOT NULL DEFAULT false,
                            status varchar(50) NOT NULL DEFAULT 'LOADED',
                            version integer NOT NULL DEFAULT 0,
                            created_at timestamp with time zone DEFAULT now(),
                            updated_at timestamp with time zone DEFAULT now(),
                            deleted_at timestamp with time zone
);

CREATE TABLE product (
                         id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                         unit_id uuid NOT NULL REFERENCES cargo_unit(id) ON DELETE CASCADE,
                         name varchar(150) NOT NULL,
                         description text,
                         quantity int NOT NULL,
                         weight_tonnes numeric(10,2) NOT NULL,
                         category varchar(80),
                         hazardous_product boolean NOT NULL DEFAULT false,
                         version integer NOT NULL DEFAULT 0,
                         created_at timestamp with time zone DEFAULT now(),
                         updated_at timestamp with time zone DEFAULT now(),
                         deleted_at timestamp with time zone
);

-- 7. TELEMETR�A E INCIDENTES
CREATE TABLE ship_positions (
                                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                ship_id uuid NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
                                plan_id uuid REFERENCES travel_plan(id) ON DELETE CASCADE,
                                latitude double precision NOT NULL,
                                longitude double precision NOT NULL,
                                speed_knots numeric(6,2),
                                course_degrees numeric(5,2),
                                weather_temp_celsius numeric(5,2),
                                weather_condition varchar(50),
                                recorded_at timestamp with time zone NOT NULL DEFAULT now(),
                                version integer NOT NULL DEFAULT 0,
                                created_at timestamp with time zone DEFAULT now(),
                                updated_at timestamp with time zone DEFAULT now(),
                                deleted_at timestamp with time zone
);

CREATE TABLE tank_readings (
                               id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                               tank_id uuid NOT NULL REFERENCES ship_tanks(id) ON DELETE CASCADE,
                               plan_id uuid REFERENCES travel_plan(id) ON DELETE SET NULL,
                               current_volume_liters numeric(12,2) NOT NULL,
                               fill_percentage numeric(5,2),
                               recorded_at timestamp with time zone NOT NULL DEFAULT now(),
                               version integer NOT NULL DEFAULT 0,
                               created_at timestamp with time zone DEFAULT now(),
                               updated_at timestamp with time zone DEFAULT now(),
                               deleted_at timestamp with time zone
);

CREATE TABLE incidents (
                           id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                           severity varchar(50) NOT NULL,
                           incident_type varchar(100) NOT NULL,
                           description text NOT NULL,
                           recorded_at timestamp with time zone NOT NULL DEFAULT now(),
                           is_resolved boolean DEFAULT false,
                           ship_id uuid NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
                           plan_id uuid REFERENCES travel_plan(id) ON DELETE CASCADE,
                           unit_id uuid REFERENCES cargo_unit(id) ON DELETE SET NULL,
                           reported_by uuid REFERENCES users(id) ON DELETE SET NULL,
                           version integer NOT NULL DEFAULT 0,
                           created_at timestamp with time zone DEFAULT now(),
                           updated_at timestamp with time zone DEFAULT now(),
                           deleted_at timestamp with time zone
);

CREATE TABLE notifications (
                               id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                               user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                               title varchar(150) NOT NULL,
                               message text NOT NULL,
                               notification_type varchar(80),
                               status varchar(50) DEFAULT 'UNREAD',
                               source varchar(100),
                               version integer NOT NULL DEFAULT 0,
                               created_at timestamp with time zone DEFAULT now(),
                               updated_at timestamp with time zone DEFAULT now(),
                               deleted_at timestamp with time zone
);

-- ==========================================================
-- 8. CONSTRAINTS
-- ==========================================================
ALTER TABLE countries ADD CONSTRAINT chk_country_iso_len CHECK (char_length(iso_code) = 2);
ALTER TABLE travel_plan ADD CONSTRAINT chk_tp_dates CHECK (departure_time <= eta);
ALTER TABLE travel_plan ADD CONSTRAINT chk_tp_progress CHECK (progress_percentage BETWEEN 0 AND 100);
ALTER TABLE stop ADD CONSTRAINT chk_stop_sequence_positive CHECK (sequence > 0);
ALTER TABLE tank_readings ADD CONSTRAINT chk_tank_percentage CHECK (fill_percentage BETWEEN 0 AND 100);
ALTER TABLE incidents ADD CONSTRAINT chk_severity CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL', 'FATAL'));
ALTER TABLE cargo_unit ADD CONSTRAINT chk_cargo_unit_status CHECK (status IN ('PENDING', 'LOADED', 'IN_TRANSIT', 'UNLOADED', 'DAMAGED'));

-- ==========================================================
-- 9. �NDICES FOREIGN KEYS Y SYNC (Performance y Offline-First)
-- ==========================================================
-- FK Indexes (Previenen Table Locks y aceleran JOINs)
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_people_country ON people(country_id);
CREATE INDEX idx_ships_country ON ships(country_id);
CREATE INDEX idx_engines_ship ON engines(ship_id);
CREATE INDEX idx_tbo_engine ON tbo(engine_id);
CREATE INDEX idx_shiptanks_ship ON ship_tanks(ship_id);
CREATE INDEX idx_ports_country ON ports(country_id);
CREATE INDEX idx_tp_ports ON travel_plan(origin_port_id, destination_port_id);
CREATE INDEX idx_stop_port ON stop(port_id);
CREATE INDEX idx_tpc_crew ON travel_plan_crew(crew_member_id);
CREATE INDEX idx_cunit_ship_plan ON cargo_unit(ship_id, travel_plan_id);
CREATE INDEX idx_product_unit ON product(unit_id);
CREATE INDEX idx_incidents_ship_unresolved ON incidents(ship_id) WHERE is_resolved = false;
CREATE INDEX idx_notif_user ON notifications(user_id);
CREATE INDEX idx_log_att_username ON login_attempts(username, attempt_time DESC);
CREATE INDEX idx_log_att_ip ON login_attempts(ip_address, attempt_time DESC);
CREATE INDEX idx_pwdreset_user_code ON password_reset_codes(user_id, code);

-- Custom Queries Indexes
CREATE INDEX idx_people_document ON people(document_number);
CREATE INDEX idx_tp_ship_status ON travel_plan(ship_id, status);
CREATE INDEX idx_cunit_code ON cargo_unit(unit_code);
CREATE INDEX idx_maintenance_ship_status ON maintenance(ship_id, status);
CREATE INDEX idx_shippos_ship_time ON ship_positions(ship_id, recorded_at DESC);
CREATE INDEX idx_tankreadings_tank_time ON tank_readings(tank_id, recorded_at DESC);

-- SYNC EXTREME PERFORMANCE: �ndices en updated_at para Queries Offline (PWA -> DB)
CREATE INDEX idx_countries_updated_at ON countries(updated_at);
CREATE INDEX idx_roles_updated_at ON roles(updated_at);
CREATE INDEX idx_cargo_type_updated_at ON cargo_type(updated_at);
CREATE INDEX idx_users_updated_at ON users(updated_at);
CREATE INDEX idx_sysattach_updated_at ON system_attachments(updated_at);
CREATE INDEX idx_logatt_updated_at ON login_attempts(updated_at);
CREATE INDEX idx_pwdreset_updated_at ON password_reset_codes(updated_at);
CREATE INDEX idx_people_updated_at ON people(updated_at);
CREATE INDEX idx_crew_updated_at ON crew_members(updated_at);
CREATE INDEX idx_ships_updated_at ON ships(updated_at);
CREATE INDEX idx_engines_updated_at ON engines(updated_at);
CREATE INDEX idx_tbo_updated_at ON tbo(updated_at);
CREATE INDEX idx_shiptanks_updated_at ON ship_tanks(updated_at);
CREATE INDEX idx_maintenance_updated_at ON maintenance(updated_at);
CREATE INDEX idx_ports_updated_at ON ports(updated_at);
CREATE INDEX idx_tp_updated_at ON travel_plan(updated_at);
CREATE INDEX idx_stop_updated_at ON stop(updated_at);
CREATE INDEX idx_tpc_updated_at ON travel_plan_crew(updated_at);
CREATE INDEX idx_cunit_updated_at ON cargo_unit(updated_at);
CREATE INDEX idx_product_updated_at ON product(updated_at);
CREATE INDEX idx_shippos_updated_at ON ship_positions(updated_at);
CREATE INDEX idx_tankreadings_updated_at ON tank_readings(updated_at);
CREATE INDEX idx_incidents_updated_at ON incidents(updated_at);
CREATE INDEX idx_notifications_updated_at ON notifications(updated_at);

-- ==========================================================
-- 10. TRIGGERS `updated_at` (Vital para Sync Offline)
-- ==========================================================
CREATE TRIGGER update_countries_modtime BEFORE UPDATE ON countries FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_roles_modtime BEFORE UPDATE ON roles FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_cargo_type_modtime BEFORE UPDATE ON cargo_type FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_sysattach_modtime BEFORE UPDATE ON system_attachments FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_logatt_modtime BEFORE UPDATE ON login_attempts FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_pwdreset_modtime BEFORE UPDATE ON password_reset_codes FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_people_modtime BEFORE UPDATE ON people FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_crew_modtime BEFORE UPDATE ON crew_members FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_ships_modtime BEFORE UPDATE ON ships FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_engines_modtime BEFORE UPDATE ON engines FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_tbo_modtime BEFORE UPDATE ON tbo FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_shiptanks_modtime BEFORE UPDATE ON ship_tanks FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_maint_modtime BEFORE UPDATE ON maintenance FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_ports_modtime BEFORE UPDATE ON ports FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_travel_plan_modtime BEFORE UPDATE ON travel_plan FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_stop_modtime BEFORE UPDATE ON stop FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_travel_crew_modtime BEFORE UPDATE ON travel_plan_crew FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_cargo_unit_modtime BEFORE UPDATE ON cargo_unit FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_product_modtime BEFORE UPDATE ON product FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_shippos_modtime BEFORE UPDATE ON ship_positions FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_tankread_modtime BEFORE UPDATE ON tank_readings FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_incidents_modtime BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_notif_modtime BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
