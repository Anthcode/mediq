/*
  Migracja implementująca schemat bazy danych dla systemu lekarzy MedIQ

  Zakres:
  1. Tabele główne:
    - doctors: dane lekarzy
    - addresses: adresy gabinetów
    - specialties: specjalizacje lekarskie
    - expertise_areas: obszary ekspertyzy
    - ratings: oceny lekarzy
    - search_history: historia wyszukiwań
  2. Tabele łączące (junction):
    - doctors_specialties
    - doctors_expertise_areas
  3. Indeksy i polityki bezpieczeństwa
*/

-- Tworzenie konfiguracji wyszukiwania tekstu dla języka polskiego
CREATE TEXT SEARCH CONFIGURATION public.polish ( COPY = pg_catalog.simple );

-- Tabela doctors
CREATE TABLE IF NOT EXISTS doctors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    experience integer,
    education text,
    bio text,
    profile_image_url text,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tabela addresses
CREATE TABLE IF NOT EXISTS addresses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    street text,
    city text,
    state text,
    postal_code text,
    country text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tabela specialties
CREATE TABLE IF NOT EXISTS specialties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tabela łącząca doctors_specialties
CREATE TABLE IF NOT EXISTS doctors_specialties (
    doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    specialty_id uuid NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, specialty_id)
);

-- Tabela expertise_areas
CREATE TABLE IF NOT EXISTS expertise_areas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tabela łącząca doctors_expertise_areas
CREATE TABLE IF NOT EXISTS doctors_expertise_areas (
    doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    expertise_area_id uuid NOT NULL REFERENCES expertise_areas(id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, expertise_area_id)
);

-- Tabela ratings
CREATE TABLE IF NOT EXISTS ratings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tabela search_history
CREATE TABLE IF NOT EXISTS search_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    query text NOT NULL,
    specialties jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Indeks pełnotekstowy dla wyszukiwania lekarzy
CREATE INDEX idx_doctors_fulltext ON doctors 
USING gin(to_tsvector('public.polish', first_name || ' ' || last_name));

-- Triggery aktualizacji timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_doctors_updated_at
    BEFORE UPDATE ON doctors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Włączenie Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE expertise_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors_expertise_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Polityki RLS dla doctors
CREATE POLICY "Doctors are viewable by everyone"
    ON doctors FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Doctors can only be modified by administrators"
    ON doctors FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'administrator');

-- Polityki RLS dla addresses
CREATE POLICY "Addresses are viewable by everyone"
    ON addresses FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Addresses can only be modified by administrators"
    ON addresses FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'administrator');

-- Polityki RLS dla specialties
CREATE POLICY "Specialties are viewable by everyone"
    ON specialties FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Specialties can only be modified by administrators"
    ON specialties FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'administrator');

-- Polityki RLS dla expertise_areas
CREATE POLICY "Expertise areas are viewable by everyone"
    ON expertise_areas FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Expertise areas can only be modified by administrators"
    ON expertise_areas FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'administrator');

-- Polityki RLS dla ratings
CREATE POLICY "Ratings are viewable by everyone"
    ON ratings FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Users can create ratings"
    ON ratings FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own ratings"
    ON ratings FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
    ON ratings FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Polityki RLS dla search_history
CREATE POLICY "Users can view their own search history"
    ON search_history FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create search history entries"
    ON search_history FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Indeksy dla poprawy wydajności
CREATE INDEX idx_doctors_active ON doctors(active);
CREATE INDEX idx_addresses_doctor_id ON addresses(doctor_id);
CREATE INDEX idx_ratings_doctor_id ON ratings(doctor_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at DESC);