ALTER TABLE ports
ADD COLUMN code VARCHAR(10) UNIQUE,
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN contact_phone VARCHAR(50),
ADD COLUMN contact_email VARCHAR(150),
ADD COLUMN timezone VARCHAR(40),
ADD COLUMN status VARCHAR(30) DEFAULT 'OPERATIONAL',
ADD COLUMN province_id UUID REFERENCES provinces(id),
ADD COLUMN city_id UUID REFERENCES cities(id);

-- Fix code to be NOT NULL after potential existing data
-- If this was a production database with existing ports, we would need to handle
-- setting a default code for existing rows before adding NOT NULL.
-- Since this is an early stage, we can just alter it. If there's an error on existing rows,
-- we'd do an UPDATE first, but for now we enforce the constraint:
ALTER TABLE ports ALTER COLUMN code SET NOT NULL;
