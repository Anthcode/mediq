-- Naprawa nieskończonej rekursji w politykach RLS dla tabeli profiles

-- 1. Tymczasowo wyłączamy RLS dla tabeli profiles, by uniknąć problemów podczas migracji
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Usuwamy wszystkie istniejące polityki dla tabeli profiles, które mogą powodować rekursję
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Moderators can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable profile creation on signup" ON profiles;
DROP POLICY IF EXISTS "Disable profile deletion" ON profiles;

-- 3. Tworzymy właściwe polityki bez rekursji

-- Publiczny dostęp do odczytu (dla użytkowników niezalogowanych)
CREATE POLICY "Public read access to profiles"
    ON profiles FOR SELECT
    TO anon, authenticated
    USING (true);

-- Tworzenie profilu - tylko dla uwierzytelnionych i tylko własny profil
CREATE POLICY "Enable profile creation on signup"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Aktualizacja profilu - tylko własnego
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Blokowanie usuwania profili
CREATE POLICY "Disable profile deletion"
    ON profiles FOR DELETE
    TO authenticated
    USING (false);

-- 4. Włączenie RLS z powrotem
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Upewniamy się, że wartości roli są poprawne
UPDATE profiles
SET role = 'administrator'
WHERE role = 'admin';

UPDATE profiles
SET role = 'user'
WHERE role NOT IN ('user', 'administrator', 'doctor', 'moderator');

-- 6. Poprawka dla polityki dotyczącej tabeli doctors
DROP POLICY IF EXISTS "Enable all access for admin users" ON doctors;
CREATE POLICY "Enable all access for admin users" ON doctors
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.users.id
                AND profiles.role = 'administrator'
            )
        )
    );

-- 7. Dodanie komentarza
COMMENT ON TABLE profiles IS 'Profile information for each user, linked to auth.users via id';
