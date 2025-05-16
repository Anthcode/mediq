-- Funkcja do tworzenia profilu użytkownika z odpowiednimi uprawnieniami
CREATE OR REPLACE FUNCTION public.create_user_profile(
    user_id uuid,
    user_email text,
    user_first_name text,
    user_last_name text
) RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Sprawdź czy użytkownik już ma profil
    IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
        RAISE EXCEPTION 'Profil dla tego użytkownika już istnieje';
    END IF;

    -- Wstaw nowy profil
    INSERT INTO profiles (
        id,
        email,
        first_name,
        last_name,
        role
    ) VALUES (
        user_id,
        user_email,
        user_first_name,
        user_last_name,
        'user'
    );
END;
$$;
