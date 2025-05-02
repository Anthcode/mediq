# Schemat Bazy Danych dla MedIQ

## 1. Tabele

### 1.0. users
Tabela zarządzana przez Supabase Auth (nie modyfikować ręcznie).

- id UUID PRIMARY KEY
- email VARCHAR(255) NOT NULL UNIQUE
- encrypted_password VARCHAR NOT NULL
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()
- confirmed_at TIMESTAMPTZ

### 1.1. profiles
Tabela rozszerzająca natywną tabelę `auth.users` o dodatkowe informacje profilowe.

- id UUID PRIMARY KEY – klucz główny, identyczny jak w `auth.users`
- role VARCHAR(20) NOT NULL – rola użytkownika (np. "patient", "administrator")
- first_name TEXT – imię użytkownika (opcjonalne)
- last_name TEXT – nazwisko użytkownika (opcjonalne)
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()
- updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

### 1.2. doctors
Tabela przechowująca informacje o lekarzach.

- id UUID PRIMARY KEY
- first_name TEXT NOT NULL
- last_name TEXT NOT NULL
- experience INTEGER – liczba lat doświadczenia
- education TEXT
- bio TEXT
- profile_image_url TEXT
- active BOOLEAN NOT NULL DEFAULT TRUE
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()
- updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

### 1.3. addresses
Tabela zawierająca dane adresowe powiązane z lekarzami (relacja jeden-do-wielu).

- id UUID PRIMARY KEY
- doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE
- street TEXT
- city TEXT
- state TEXT
- postal_code TEXT
- country TEXT
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()
- updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

### 1.4. specialties
Tabela przechowująca listę specjalizacji lekarskich.

- id UUID PRIMARY KEY
- name TEXT NOT NULL UNIQUE
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()
- updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

### 1.5. doctors_specialties
Tabela łącząca (junction) dla relacji wiele-do-wielu między lekarzami a specjalizacjami.

- doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE
- specialty_id UUID NOT NULL REFERENCES specialties(id) ON DELETE CASCADE
- PRIMARY KEY (doctor_id, specialty_id)

### 1.6. expertise_areas
Tabela z obszarami ekspertyzy definiowanymi przez administratorów.

- id UUID PRIMARY KEY
- name TEXT NOT NULL UNIQUE
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()
- updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

### 1.7. doctors_expertise_areas
Tabela łącząca dla relacji wiele-do-wielu między lekarzami a obszarami ekspertyzy.

- doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE
- expertise_area_id UUID NOT NULL REFERENCES expertise_areas(id) ON DELETE CASCADE
- PRIMARY KEY (doctor_id, expertise_area_id)

### 1.8. ratings
Tabela przechowująca oceny lekarzy wystawiane przez użytkowników.

- id UUID PRIMARY KEY
- doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE
- user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
- rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5)
- comment TEXT
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()
- updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

### 1.9. search_history
Tabela przechowująca historię wyszukiwań użytkowników.

- id UUID PRIMARY KEY
- user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
- query TEXT NOT NULL – pełne zapytanie użytkownika
- specialties JSONB – przetworzone wyniki analizy AI (np. lista sugerowanych specjalizacji)
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()

## 2. Relacje między Tabelami

- **users**: Tabela zarządzana przez Supabase Auth, która stanowi podstawę autentykacji.
- **profiles**: Rozszerzenie danych użytkowników (relacja 1:1 z `users`).
- **doctors** – każdy lekarz może mieć wiele **addresses** (1:N).
- **doctors** i **specialties** – relacja wiele-do-wielu poprzez tabelę **doctors_specialties**.
- **doctors** i **expertise_areas** – relacja wiele-do-wielu poprzez tabelę **doctors_expertise_areas**.
- **ratings** – powiązanie oceny z lekarzem (N:1 z doctors) oraz użytkownikiem (N:1 z profiles).
- **search_history** – każdy wpis historii należy do jednego użytkownika (N:1 z profiles).

## 3. Indeksy

- **Pełnotekstowy indeks na lekarzach**:
  ```sql
  CREATE INDEX idx_doctors_fulltext ON doctors USING gin(to_tsvector('polish', first_name || ' ' || last_name));
````

## 4. Zasady PostgreSQL (RLS)

Dla tabel zawierających dane wrażliwe (np. **profiles** oraz **search_history**) należy skonfigurować polityki RLS. Przykładowa polityka dla tabeli **search_history**:

```sql
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY search_history_owner ON search_history
  USING (user_id = current_setting('app.current_user_id')::uuid);