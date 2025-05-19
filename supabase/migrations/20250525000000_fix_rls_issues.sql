-- Ostateczna naprawa problemów z politykami RLS powodującymi nieskończoną rekursję

-- 1. Tymczasowo wyłączamy RLS dla tabeli profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Usuwamy wszystkie problematyczne polityki RLS
DROP POLICY IF EXISTS "Enable all access for admin users" ON doctors;
DROP POLICY IF EXISTS "Doctors can only be modified by administrators" ON doctors;

-- 3. Tworzymy nowe polityki korzystające WYŁĄCZNIE z tabeli user_roles (nie profiles)
CREATE POLICY "Administrators can manage doctors"
    ON doctors FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'administrator'
        )
    );

-- 4. Podobnie dla adresów
DROP POLICY IF EXISTS "Addresses can only be modified by administrators" ON addresses;

CREATE POLICY "Administrators can manage addresses"
    ON addresses FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'administrator'
        )
    );

-- 5. Zapewniamy, że profile mają odpowiednie polityki RLS bez rekursji
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Polityka dla odczytu - dostęp publiczny
CREATE POLICY "Anyone can view profiles"
    ON profiles FOR SELECT
    USING (true);

-- Polityka dla aktualizacji - tylko własny profil
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 6. Usuwamy wszystkie pozostałe odwołania do role w tabeli profiles z innych polityk
DO $$
DECLARE
    policy_record RECORD;
    policy_def TEXT;
BEGIN
    FOR policy_record IN 
        SELECT policyname, tablename, schemaname
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        -- Pobieramy definicję polityki
        SELECT pg_get_expr(polqual, polrelid) INTO policy_def
        FROM pg_policy 
        WHERE polname = policy_record.policyname;
        
        -- Sprawdzamy czy definicja zawiera odwołanie do profiles.role
        IF policy_def LIKE '%profiles.role%' THEN
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                          policy_record.policyname,
                          policy_record.schemaname,
                          policy_record.tablename);
        END IF;
    END LOOP;
END $$;

-- 7. Włączamy RLS z powrotem dla tabeli profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 8. Dodajemy komentarz informujący o zmianie
COMMENT ON TABLE profiles IS 'Profile information for each user, linked to auth.users via id. Role information moved to user_roles table.';
COMMENT ON TABLE user_roles IS 'User role information, linked to auth.users via user_id. Replaces role column in profiles table.';
