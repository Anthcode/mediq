[
  {
    "table_ddl": "CREATE TABLE IF NOT EXISTS addresses (id uuid NOT NULL DEFAULT gen_random_uuid(), doctor_id uuid NOT NULL, street text, city text, state text, postal_code text, country text, created_at timestamp with time zone NOT NULL DEFAULT now(), updated_at timestamp with time zone NOT NULL DEFAULT now());"
  },
  {
    "table_ddl": "CREATE TABLE IF NOT EXISTS doctors (id uuid NOT NULL DEFAULT gen_random_uuid(), first_name text NOT NULL, last_name text NOT NULL, experience integer, education text, bio text, profile_image_url text, active boolean NOT NULL DEFAULT true, created_at timestamp with time zone NOT NULL DEFAULT now(), updated_at timestamp with time zone NOT NULL DEFAULT now(), specialties text);"
  },
  {
    "table_ddl": "CREATE TABLE IF NOT EXISTS profiles (id uuid NOT NULL, email text NOT NULL, first_name text, last_name text, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone NOT NULL DEFAULT now(), role USER-DEFINED NOT NULL DEFAULT 'user'::user_role);"
  },
  {
    "table_ddl": "CREATE TABLE IF NOT EXISTS ratings (id uuid NOT NULL DEFAULT gen_random_uuid(), doctor_id uuid NOT NULL, user_id uuid NOT NULL, rating integer NOT NULL, comment text, created_at timestamp with time zone NOT NULL DEFAULT now(), updated_at timestamp with time zone NOT NULL DEFAULT now());"
  },
  {
    "table_ddl": "CREATE TABLE IF NOT EXISTS search_history (id uuid NOT NULL DEFAULT gen_random_uuid(), user_id uuid NOT NULL, query text NOT NULL, specialties jsonb, created_at timestamp with time zone NOT NULL DEFAULT now());"
  }
]

[
  {
    "index_creation": "CREATE INDEX IF NOT EXISTS addresses_pkey ON addresses USING CREATE UNIQUE INDEX addresses_pkey ON public.addresses USING btree (id);"
  },
  {
    "index_creation": "CREATE INDEX IF NOT EXISTS idx_addresses_doctor_id ON addresses USING CREATE INDEX idx_addresses_doctor_id ON public.addresses USING btree (doctor_id);"
  },
  {
    "index_creation": "CREATE INDEX IF NOT EXISTS doctors_pkey ON doctors USING CREATE UNIQUE INDEX doctors_pkey ON public.doctors USING btree (id);"
  },
  {
    "index_creation": "CREATE INDEX IF NOT EXISTS idx_doctors_fulltext ON doctors USING CREATE INDEX idx_doctors_fulltext ON public.doctors USING gin (to_tsvector('polish'::regconfig, ((first_name || ' '::text) || last_name)));"
  },
  {
    "index_creation": "CREATE INDEX IF NOT EXISTS idx_doctors_active ON doctors USING CREATE INDEX idx_doctors_active ON public.doctors USING btree (active);"
  },
  {
    "index_creation": "CREATE INDEX IF NOT EXISTS profiles_pkey ON profiles USING CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);"
  },
  {
    "index_creation": "CREATE INDEX IF NOT EXISTS ratings_pkey ON ratings USING CREATE UNIQUE INDEX ratings_pkey ON public.ratings USING btree (id);"
  },
  {
    "index_creation": "CREATE INDEX IF NOT EXISTS idx_ratings_doctor_id ON ratings USING CREATE INDEX idx_ratings_doctor_id ON public.ratings USING btree (doctor_id);"
  },
  {
    "index_creation": "CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings USING CREATE INDEX idx_ratings_user_id ON public.ratings USING btree (user_id);"
  },
  {
    "index_creation": "CREATE INDEX IF NOT EXISTS search_history_pkey ON search_history USING CREATE UNIQUE INDEX search_history_pkey ON public.search_history USING btree (id);"
  },
  {
    "index_creation": "CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history USING CREATE INDEX idx_search_history_user_id ON public.search_history USING btree (user_id);"
  },
  {
    "index_creation": "CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history USING CREATE INDEX idx_search_history_created_at ON public.search_history USING btree (created_at DESC);"
  }
]


[
  {
    "trigger_creation": "CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION EXECUTE FUNCTION update_updated_at_column();"
  },
  {
    "trigger_creation": "CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION EXECUTE FUNCTION update_updated_at_column();"
  },
  {
    "trigger_creation": "CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION EXECUTE FUNCTION update_updated_at_column();"
  }
]

