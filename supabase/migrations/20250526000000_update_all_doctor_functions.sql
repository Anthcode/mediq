-- Aktualizacja funkcji związanych z lekarzami, aby korzystały z tabeli user_roles zamiast profiles.role

-- 1. Aktualizacja funkcji CreateDoctor
CREATE OR REPLACE FUNCTION public.create_doctor(
  p_first_name TEXT,
  p_last_name TEXT,
  p_specialties TEXT,
  p_experience INTEGER DEFAULT NULL,
  p_education TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_profile_image_url TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_doctor_id UUID;
BEGIN
  -- Sprawdź uprawnienia użytkownika
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() 
    AND role = 'administrator'
  ) THEN
    RAISE EXCEPTION 'Brak uprawnień do wykonania tej operacji';
  END IF;

  -- Wstaw nowego lekarza
  INSERT INTO doctors (
    first_name,
    last_name,
    specialties,
    experience,
    education,
    bio,
    profile_image_url
  ) VALUES (
    p_first_name,
    p_last_name,
    p_specialties,
    p_experience,
    p_education,
    p_bio,
    p_profile_image_url
  )
  RETURNING id INTO v_doctor_id;

  RETURN v_doctor_id;
END;
$$;

-- 2. Aktualizacja funkcji UpdateDoctor
CREATE OR REPLACE FUNCTION public.update_doctor(
  p_doctor_id UUID,
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_specialties TEXT DEFAULT NULL,
  p_experience INTEGER DEFAULT NULL,
  p_education TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_profile_image_url TEXT DEFAULT NULL,
  p_active BOOLEAN DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Sprawdź uprawnienia użytkownika
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() 
    AND role = 'administrator'
  ) THEN
    RAISE EXCEPTION 'Brak uprawnień do wykonania tej operacji';
  END IF;

  -- Sprawdź czy lekarz istnieje
  IF NOT EXISTS (SELECT 1 FROM doctors WHERE id = p_doctor_id) THEN
    RAISE EXCEPTION 'Lekarz o podanym ID nie istnieje';
  END IF;

  -- Aktualizuj lekarza, tylko niepuste pola
  UPDATE doctors
  SET
    first_name = COALESCE(p_first_name, first_name),
    last_name = COALESCE(p_last_name, last_name),
    specialties = COALESCE(p_specialties, specialties),
    experience = COALESCE(p_experience, experience),
    education = COALESCE(p_education, education),
    bio = COALESCE(p_bio, bio),
    profile_image_url = COALESCE(p_profile_image_url, profile_image_url),
    active = COALESCE(p_active, active),
    updated_at = now()
  WHERE id = p_doctor_id;

  RETURN true;
END;
$$;

-- 3. Aktualizacja funkcji DeleteDoctor
CREATE OR REPLACE FUNCTION public.delete_doctor(
  p_doctor_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Sprawdź uprawnienia użytkownika
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() 
    AND role = 'administrator'
  ) THEN
    RAISE EXCEPTION 'Brak uprawnień do wykonania tej operacji';
  END IF;

  -- Sprawdź czy lekarz istnieje
  IF NOT EXISTS (SELECT 1 FROM doctors WHERE id = p_doctor_id) THEN
    RAISE EXCEPTION 'Lekarz o podanym ID nie istnieje';
  END IF;

  -- Usuń lekarza (usunie również powiązane adresy dzięki ON DELETE CASCADE)
  DELETE FROM doctors WHERE id = p_doctor_id;

  RETURN true;
END;
$$;
