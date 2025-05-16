-- Funkcja do tworzenia nowego lekarza
CREATE OR REPLACE FUNCTION public.create_doctor(doctor_data jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_doctor_id uuid;
    address_data jsonb;
BEGIN
    -- Wyodrębnienie danych adresowych
    address_data := doctor_data->'address';
    
    -- Wstawienie nowego lekarza
    INSERT INTO doctors (
        first_name,
        last_name,
        experience,
        education,
        bio,
        profile_image_url,
        specialties,
        active
    ) VALUES (
        (doctor_data->>'first_name')::text,
        (doctor_data->>'last_name')::text,
        (doctor_data->>'experience')::integer,
        (doctor_data->>'education')::text,
        (doctor_data->>'bio')::text,
        (doctor_data->>'profile_image_url')::text,
        (doctor_data->>'specialties')::text,
        COALESCE((doctor_data->>'active')::boolean, true)
    )
    RETURNING id INTO new_doctor_id;

    -- Wstawienie adresu jeśli podano
    IF address_data IS NOT NULL THEN
        INSERT INTO addresses (
            doctor_id,
            street,
            city,
            state,
            postal_code,
            country
        ) VALUES (
            new_doctor_id,
            (address_data->>'street')::text,
            (address_data->>'city')::text,
            (address_data->>'state')::text,
            (address_data->>'postal_code')::text,
            (address_data->>'country')::text
        );
    END IF;

    RETURN new_doctor_id;
END;
$$;

-- Funkcja do aktualizacji danych lekarza
CREATE OR REPLACE FUNCTION public.update_doctor(doctor_id uuid, doctor_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    address_data jsonb;
BEGIN
    -- Wyodrębnienie danych adresowych
    address_data := doctor_data->'address';
    
    -- Aktualizacja danych lekarza
    UPDATE doctors SET
        first_name = COALESCE((doctor_data->>'first_name')::text, first_name),
        last_name = COALESCE((doctor_data->>'last_name')::text, last_name),
        experience = COALESCE((doctor_data->>'experience')::integer, experience),
        education = COALESCE((doctor_data->>'education')::text, education),
        bio = COALESCE((doctor_data->>'bio')::text, bio),
        profile_image_url = COALESCE((doctor_data->>'profile_image_url')::text, profile_image_url),
        specialties = COALESCE((doctor_data->>'specialties')::text, specialties),
        active = COALESCE((doctor_data->>'active')::boolean, active),
        updated_at = now()
    WHERE id = doctor_id;

    -- Aktualizacja lub wstawienie adresu
    IF address_data IS NOT NULL THEN
        -- Próba aktualizacji istniejącego adresu
        UPDATE addresses SET
            street = COALESCE((address_data->>'street')::text, street),
            city = COALESCE((address_data->>'city')::text, city),
            state = COALESCE((address_data->>'state')::text, state),
            postal_code = COALESCE((address_data->>'postal_code')::text, postal_code),
            country = COALESCE((address_data->>'country')::text, country),
            updated_at = now()
        WHERE doctor_id = doctor_id;
        
        -- Jeśli adres nie istnieje, dodaj nowy
        IF NOT FOUND THEN
            INSERT INTO addresses (
                doctor_id,
                street,
                city,
                state,
                postal_code,
                country
            ) VALUES (
                doctor_id,
                (address_data->>'street')::text,
                (address_data->>'city')::text,
                (address_data->>'state')::text,
                (address_data->>'postal_code')::text,
                (address_data->>'country')::text
            );
        END IF;
    END IF;
END;
$$;

-- Dodanie polityk Row Level Security (RLS)
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Polityka dla odczytu (wszyscy mogą czytać aktywnych lekarzy)
CREATE POLICY "Enable read access for all users" ON doctors
    FOR SELECT
    USING (active = true);

-- Polityka dla tworzenia/aktualizacji/usuwania (tylko dla admina)
CREATE POLICY "Enable all access for admin users" ON doctors
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
