CREATE SEQUENCE IF NOT EXISTS personnel_file_seq
    START WITH 2  -- Empezamos en 2 porque el 1 ya existe en tu tabla
    INCREMENT BY 1;