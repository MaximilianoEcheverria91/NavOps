-- V8__add_contact_web_to_ports.sql

ALTER TABLE ports
    ADD COLUMN contact_web VARCHAR(200);
