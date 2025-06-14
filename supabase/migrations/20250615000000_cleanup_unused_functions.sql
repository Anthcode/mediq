-- Migracja usuwająca niepotrzebne funkcje i poprawiająca handle_new_user
-- Data: 2025-06-15

-- 1. USUWANIE NIEPOTRZEBNYCH FUNKCJI LEKARZY

-- Usuń nowe wersje funkcji lekarzy (nie używane w kodzie)
DROP FUNCTION IF EXISTS public.create_doctor(
  p_first_name TEXT,
  p_last_name TEXT,
  p_specialties TEXT,
  p_experience INTEGER,
  p_education TEXT,
  p_bio TEXT,
  p_profile_image_url TEXT
);

DROP FUNCTION IF EXISTS public.update_doctor(
  p_doctor_id UUID,
  p_first_name TEXT,
  p_last_name TEXT,
  p_specialties TEXT,
  p_experience INTEGER,
  p_education TEXT,
  p_bio TEXT,
  p_profile_image_url TEXT,
  p_active BOOLEAN
);

DROP FUNCTION IF EXISTS public.delete_doctor(p_doctor_id UUID);

-- Usuń starą wersję update_doctor (nie używana w kodzie)
DROP FUNCTION IF EXISTS public.update_doctor(doctor_id uuid, doctor_data jsonb);

-- 2. AKTUALIZACJA FUNKCJI handle_new_user

-- Zaktualizuj handle_new_user aby tworzył kompletny profil użytkownika
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Wstaw profil użytkownika z danymi z rejestracji
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  
  -- Wstaw domyślną rolę użytkownika
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 3. KOMENTARZ PODSUMOWUJĄCY

-- Funkcje zachowane (używane w kodzie):
-- ✅ public.create_doctor(doctor_data jsonb) - używana w createDoctor()
-- ✅ public.manage_doctor_addresses(p_doctor_id uuid, p_addresses jsonb) - używana w updateDoctor()
-- ✅ public.handle_new_user() - zaktualizowana do tworzenia kompletnego profilu
-- ✅ update_updated_at_column() - używana przez triggery

-- Funkcje usunięte (nie używane):
-- ❌ public.create_doctor(p_first_name TEXT, ...) - nowa wersja z parametrami
-- ❌ public.update_doctor(p_doctor_id UUID, ...) - nowa wersja z parametrami
-- ❌ public.update_doctor(doctor_id uuid, doctor_data jsonb) - stara wersja z jsonb
-- ❌ public.delete_doctor(p_doctor_id UUID) - nowa wersja
-- ❌ public.create_user_profile(...) - już usunięta przez użytkownika
