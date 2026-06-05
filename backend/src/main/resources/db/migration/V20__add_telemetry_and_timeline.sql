CREATE TABLE ship_telemetry (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id uuid NOT NULL REFERENCES travel_plan(id) ON DELETE CASCADE,
    latitude numeric(9,6) NOT NULL,
    longitude numeric(9,6) NOT NULL,
    speed_knots numeric(4,1) NOT NULL,
    heading integer NOT NULL,
    weather_condition varchar(100),
    version integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    recorded_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_telemetry_plan_time ON ship_telemetry (plan_id, recorded_at DESC);

CREATE TABLE travel_plan_timeline (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id uuid NOT NULL REFERENCES travel_plan(id) ON DELETE CASCADE,
    event_type varchar(50) NOT NULL,
    event_time timestamp with time zone NOT NULL DEFAULT now(),
    remarks text,
    version integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);
