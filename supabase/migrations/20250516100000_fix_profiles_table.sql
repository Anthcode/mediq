-- Poprawienie struktury tabeli profiles i polityk bezpieczeństwa

-- Dodanie powiązania profiles.id z auth.users.id
ALTER TABLE profiles
    ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id) REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Polityka dla tworzenia profili (przy rejestracji)
CREATE POLICY "Enable profile creation on signup"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Upewnienie się, że email będzie unikalny i nie null
ALTER TABLE profiles
    ALTER COLUMN email SET NOT NULL,
    ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Poprawienie polityki aktualizacji profilu
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
