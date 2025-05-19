-- Migracja usuwająca zdeprecjonowaną kolumnę role z tabeli profiles
-- UWAGA: Wykonaj tę migrację tylko wtedy, gdy wszystkie komponenty aplikacji
-- zostały zaktualizowane, aby korzystać z tabeli user_roles zamiast profiles.role

-- 1. Upewnij się, że wszystkie niezbędne dane zostały zmigrowane do user_roles
DO $$
BEGIN
  -- Sprawdź, czy istnieją profile bez odpowiadających im ról w user_roles
  IF EXISTS (
    SELECT p.id FROM profiles p
    LEFT JOIN user_roles ur ON p.id = ur.user_id
    WHERE ur.user_id IS NULL
  ) THEN
    -- Jeśli takie istnieją, utwórz dla nich wpisy w user_roles
    INSERT INTO user_roles (user_id, role)
    SELECT p.id, p.role
    FROM profiles p
    LEFT JOIN user_roles ur ON p.id = ur.user_id
    WHERE ur.user_id IS NULL;
  END IF;
END $$;

-- 2. Usunięcie kolumny role z tabeli profiles
ALTER TABLE profiles DROP COLUMN role;
