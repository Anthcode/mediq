-- Migracja rozdzielająca role użytkowników do osobnej tabeli
-- Rozwiązuje problem rekursji w politykach RLS

-- 1. Tworzenie dedykowanej tabeli ról użytkowników
CREATE TABLE IF NOT EXISTS user_roles (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('administrator', 'user', 'doctor', 'moderator')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Tworzenie triggera dla aktualizacji pola updated_at
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. Włączenie Row Level Security dla tabeli user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Tworzenie polityk RLS dla tabeli user_roles
-- Wszyscy mogą odczytywać informacje o rolach (potrzebne do wyświetlania informacji o użytkownikach)
CREATE POLICY "Public read access to user_roles"
    ON user_roles FOR SELECT
    TO anon, authenticated
    USING (true);

-- Tylko administratorzy mogą tworzyć, modyfikować i usuwać role
CREATE POLICY "Only administrators can manage user roles"
    ON user_roles FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'administrator'
        )
    );

CREATE POLICY "Only administrators can update user roles"
    ON user_roles FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'administrator'
        )
    );

CREATE POLICY "Only administrators can delete user roles"
    ON user_roles FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'administrator'
        )
    );

-- 5. Migracja danych z tabeli profiles
INSERT INTO user_roles (user_id, role)
SELECT id, role FROM profiles
ON CONFLICT (user_id) DO UPDATE
SET role = EXCLUDED.role;

-- 6. Aktualizacja polityk dla tabeli doctors
DROP POLICY IF EXISTS "Enable all access for admin users" ON doctors;
DROP POLICY IF EXISTS "Doctors can only be modified by administrators" ON doctors;

-- Polityka pozwalająca na pełny dostęp administratorom
CREATE POLICY "Enable all CRUD operations for admin users"
  ON doctors
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'administrator'
    )
  );

-- 7. Aktualizacja polityk dla tabeli addresses
DROP POLICY IF EXISTS "Addresses can only be modified by administrators" ON addresses;

CREATE POLICY "Addresses can only be modified by administrators"
  ON addresses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'administrator'
    )
  );

-- 8. Funkcja tworzenia roli użytkownika przy rejestracji
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dodanie triggera do automatycznego tworzenia roli przy rejestracji
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Oznaczenie kolumny role w tabeli profiles jako zdeprecjonowanej
COMMENT ON COLUMN profiles.role IS 'DEPRECATED: This column is deprecated. Use user_roles table instead.';
