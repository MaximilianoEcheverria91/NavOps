

-- 1. ESTRUCTURA GEOGRÁFICA
CREATE TABLE provinces (
                           id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                           name varchar(100) NOT NULL UNIQUE,
                           country_id uuid NOT NULL REFERENCES countries(id),
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

-- 2. ALTERACIONES EN PEOPLE
ALTER TABLE people DROP COLUMN IF EXISTS address_city;
ALTER TABLE people DROP COLUMN IF EXISTS address_province;

ALTER TABLE people
    ADD COLUMN province_id uuid REFERENCES provinces(id),
ADD COLUMN city_id uuid REFERENCES cities(id),
ADD COLUMN status varchar(50) DEFAULT 'ACTIVE',
ADD COLUMN marital_status_new varchar(50) DEFAULT 'SINGLE',
ADD COLUMN gender_new varchar(20) DEFAULT 'OTHER',
ADD COLUMN nationality_country_id uuid REFERENCES countries(id);

-- 3. TRADUCCIÓN DE ENUMS EXISTENTES
UPDATE people SET gender_new = 'MALE' WHERE gender = 'MASCULINO';
UPDATE people SET gender_new = 'FEMALE' WHERE gender = 'FEMENINO';
UPDATE people SET marital_status_new = 'MARRIED' WHERE marital_status = 'CASADO';
UPDATE people SET marital_status_new = 'SINGLE' WHERE marital_status = 'SOLTERO';

ALTER TABLE people DROP COLUMN gender;
ALTER TABLE people DROP COLUMN marital_status;
ALTER TABLE people RENAME COLUMN gender_new TO gender;
ALTER TABLE people RENAME COLUMN marital_status_new TO marital_status;
ALTER TABLE people DROP COLUMN IF EXISTS nationality;

-- 4. USERS Y CREW_MEMBERS
ALTER TABLE users ADD COLUMN is_blocked boolean DEFAULT false;

ALTER TABLE crew_members RENAME COLUMN status TO current_status;
UPDATE crew_members SET current_status = 'AVAILABLE';
ALTER TABLE crew_members ALTER COLUMN current_status SET DEFAULT 'AVAILABLE';

-- 5. CONSTRAINTS
ALTER TABLE people ADD CONSTRAINT chk_people_status
    CHECK (status IN ('ACTIVE', 'INACTIVE', 'VACATION', 'MEDICAL_LEAVE', 'SUSPENDED', 'MATERNITY_LEAVE'));

ALTER TABLE people ADD CONSTRAINT chk_gender
    CHECK (gender IN ('MALE', 'FEMALE', 'OTHER'));

ALTER TABLE crew_members ADD CONSTRAINT chk_crew_status
    CHECK (current_status IN ('AVAILABLE', 'ON_BOARD', 'RESTING', 'UNAVAILABLE'));

-- 6. TRIGGERS
CREATE TRIGGER update_provinces_modtime BEFORE UPDATE ON provinces FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_cities_modtime BEFORE UPDATE ON cities FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();