-- Poprawka funkcji tworzenia profilu użytkownika, aby uniknąć niejednoznacznych nazw kolumn

-- 1. Najpierw usuwamy istniejącą funkcję
DROP FUNCTION IF EXISTS public.create_user_profile(uuid, text, text, text);

-- 2. Następnie tworzymy nową funkcję z lepszymi nazwami parametrów
CREATE OR REPLACE FUNCTION public.create_user_profile(
    p_user_id uuid,    -- Zmiana nazwy parametru na p_user_id aby uniknąć niejednoznaczności
    p_user_email text,
    p_user_first_name text,
    p_user_last_name text
) RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Sprawdź czy użytkownik już ma profil
    IF EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'Profil dla tego użytkownika już istnieje';
    END IF;

    -- Wstaw nowy profil (bez kolumny role)
    INSERT INTO profiles (
        id,
        email,
        first_name,
        last_name
    ) VALUES (
        p_user_id,
        p_user_email,
        p_user_first_name,
        p_user_last_name
    );

    -- Wstaw nową rolę użytkownika
    INSERT INTO user_roles (
        user_id,
        role
    ) VALUES (
        p_user_id,
        'user'
    )
    ON CONFLICT (user_id) DO NOTHING;
END;
$$;
