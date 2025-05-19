-- Modyfikacja kolumny role w tabeli profiles po usunięciu zależnych polityk RLS
-- 1. Najpierw usunięcie polityki RLS, która używa kolumny role
DROP POLICY IF EXISTS "Enable all access for admin users" ON doctors;

-- 2. Zmiana typu kolumny role z varchar(20) na varchar(100)
ALTER TABLE profiles
    ALTER COLUMN role TYPE varchar(100);

-- 3. Odtworzenie polityki RLS po zmianie typu kolumny
CREATE POLICY "Enable all access for admin users" ON doctors
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
