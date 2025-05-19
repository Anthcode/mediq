# Plan API Aplikacji MedIQ

## 1. Wprowadzenie

Niniejszy dokument opisuje plan API dla aplikacji MedIQ. API jest budowane z wykorzystaniem Supabase, w tym jego mechanizmów autentykacji, bazy danych PostgreSQL z RESTful API oraz Supabase Edge Functions dla logiki niestandardowej (np. integracji z OpenAI).

## 2. Konwencje Ogólne

- **Base URL:** API Supabase (np. `https://<project_ref>.supabase.co`)
- **Autentykacja:** JWT (Bearer Token) zarządzane przez Supabase Auth.
- **Format Danych:** JSON.
- **Obsługa Błędów:** Standardowe kody statusu HTTP (np. 200, 201, 400, 401, 403, 404, 500).
- **Bezpieczeństwo:** Polityki Row Level Security (RLS) w Supabase będą stosowane do ochrony dostępu do danych.
- **Wersjonowanie:** Domyślnie `/rest/v1/` dla Supabase REST API, `/auth/v1/` dla Auth, `/functions/v1/` dla Edge Functions.

## 3. Modele Danych (Główne DTO)

- `UserDTO`: Dane profilu użytkownika.
- `DoctorDTO`: Pełne dane lekarza, w tym specjalizacje, obszary ekspertyzy, adresy.
- `CreateDoctorCommand`: Dane wejściowe do tworzenia nowego lekarza.
- `HealthQueryAnalysisDTO`: Wynik analizy zapytania zdrowotnego przez AI.
- `SpecialtyMatchDTO`: Informacje o dopasowanej specjalizacji.

## 4. Punkty Końcowe API

### 4.1. Autentykacja (Supabase Auth)

Zarządzane głównie przez bibliotekę kliencką Supabase. Standardowe punkty końcowe Supabase Auth:

- **Rejestracja Użytkownika**
  - `POST /auth/v1/signup`
  - Request Body: `{ email, password, data: { first_name, last_name (opcjonalnie) } }`
  - Response: Sesja użytkownika lub błąd.
- **Logowanie Użytkownika**
  - `POST /auth/v1/token?grant_type=password`
  - Request Body: `{ email, password }`
  - Response: Sesja użytkownika (zawiera JWT).
- **Wylogowanie Użytkownika**
  - `POST /auth/v1/logout` (wymaga JWT)
  - Response: `204 No Content`.
- **Pobranie Danych Użytkownika**
  - `GET /auth/v1/user` (wymaga JWT)
  - Response: Dane zalogowanego użytkownika.

### 4.2. Profile Użytkowników

- **Pobierz profil bieżącego użytkownika**
  - `GET /rest/v1/profiles?select=*&id=eq.current_user_id` (RLS zapewni, że użytkownik pobiera tylko swój profil)
  - Response: `UserDTO`.
- **Aktualizuj profil bieżącego użytkownika**
  - `PATCH /rest/v1/profiles?id=eq.current_user_id` (RLS)
  - Request Body: Częściowy `UserDTO` (np. `{ first_name, last_name }`).
  - Response: Zaktualizowany `UserDTO`.
- **Pobierz historię wyszukiwań użytkownika**
  - `GET /rest/v1/search_history?select=*&user_id=eq.current_user_id&order=created_at.desc` (RLS)
  - Response: Tablica obiektów historii wyszukiwania.
- **Dodaj do historii wyszukiwań**
  - `POST /rest/v1/search_history` (RLS, `user_id` może być automatycznie ustawione przez RLS/trigger)
  - Request Body: `{ query_text, symptoms_identified: [], suggested_specialties: [] }`
  - Response: Utworzony wpis historii.
- **Wyczyść historię wyszukiwań użytkownika**
  - `DELETE /rest/v1/search_history?user_id=eq.current_user_id` (RLS)
  - Response: `204 No Content` lub liczba usuniętych wpisów.
- **Pobierz ulubionych lekarzy użytkownika**
  - `GET /rest/v1/favorite_doctors?select=*,doctors(*)&user_id=eq.current_user_id` (RLS)
  - Response: Tablica ulubionych lekarzy z ich danymi.
- **Dodaj lekarza do ulubionych**
  - `POST /rest/v1/favorite_doctors` (RLS)
  - Request Body: `{ doctor_id }` (`user_id` z JWT/RLS).
  - Response: Utworzony wpis ulubionego lekarza.
- **Usuń lekarza z ulubionych**
  - `DELETE /rest/v1/favorite_doctors?user_id=eq.current_user_id&doctor_id=eq.{doctorId}` (RLS)
  - Response: `204 No Content`.

### 4.3. Lekarze (CRUD)

Dostęp do niektórych operacji (POST, PATCH, DELETE) może być ograniczony do administratorów przez RLS.

- **Pobierz listę lekarzy**
  - `GET /rest/v1/doctors?select=*,specialties(name),expertise_areas(name),addresses(*)`
  - Parametry Query: Możliwość filtrowania (np. `specialties.name=eq.Kardiolog`), sortowania, paginacji.
  - Response: Tablica `DoctorDTO`.
- **Pobierz szczegóły lekarza**
  - `GET /rest/v1/doctors?select=*,specialties(name),expertise_areas(name),addresses(*)&id=eq.{doctorId}`
  - Response: Pojedynczy `DoctorDTO`.
- **Utwórz nowego lekarza (Admin)**
  - `POST /rest/v1/doctors` (Chronione RLS dla adminów)
  - Request Body: `CreateDoctorCommand` (zgodnie z [.ai/view-implementation-plan.md](.ai/view-implementation-plan.md), zawiera `first_name`, `last_name`, `specialties` (tablica UUID), `expertise_areas` (tablica UUID), `addresses` itp.).
  - Response: `201 Created`, utworzony `DoctorDTO`.
- **Aktualizuj dane lekarza (Admin/Lekarz)**
  - `PATCH /rest/v1/doctors?id=eq.{doctorId}` (Chronione RLS)
  - Request Body: Częściowy `DoctorDTO`.
  - Response: Zaktualizowany `DoctorDTO`.
- **Usuń lekarza (Admin)**
  - `DELETE /rest/v1/doctors?id=eq.{doctorId}` (Chronione RLS dla adminów)
  - Response: `204 No Content`.

### 4.4. Analiza Symptomów AI (Supabase Edge Function)

- **Analizuj symptomy i zasugeruj specjalizacje**
  - `POST /functions/v1/analyze-symptoms` (Wymaga JWT)
  - Request Body:
    ```json
    {
      "query": "Tekst zapytania użytkownika opisujący symptomy",
      "available_specialties": [ // Opcjonalnie, lista dostępnych specjalizacji do rozważenia
        { "id": "uuid1", "name": "Kardiolog" },
        { "id": "uuid2", "name": "Neurolog" }
      ]
    }
    ```
  - Response: `HealthQueryAnalysisDTO`
    ```json
    {
      "symptoms": ["ból głowy", "zawroty głowy"],
      "specialtyMatches": [
        { "id": "uuid", "name": "Neurolog", "matchPercentage": 90, "reasoning": "Uzasadnienie dopasowania..." },
        // ... inne dopasowane specjalizacje (max 3-6)
      ]
    }
    ```

### 4.5. Dane Pomocnicze (Słowniki)

- **Pobierz listę specjalizacji**
  - `GET /rest/v1/specializations?select=id,name`
  - Response: Tablica obiektów specjalizacji.
- **Pobierz listę obszarów ekspertyzy**
  - `GET /rest/v1/expertise_areas?select=id,name`
  - Response: Tablica obiektów obszarów ekspertyzy.

## 5. Względy Bezpieczeństwa

- Wszystkie żądania modyfikujące dane lub dostęp do danych wrażliwych muszą być uwierzytelnione za pomocą JWT.
- Polityki RLS w Supabase będą intensywnie wykorzystywane do egzekwowania uprawnień na poziomie wierszy.
- Walidacja danych wejściowych będzie przeprowadzana zarówno na froncie (np. Zod), jak i potencjalnie w Supabase Edge Functions lub za pomocą constraintów bazy danych.
- Klucze API (np. OpenAI) będą przechowywane bezpiecznie jako sekrety w Supabase.

## 6. Obsługa Błędów

Standardowe kody HTTP będą używane do sygnalizowania statusu operacji. Odpowiedzi błędów (4xx, 5xx) powinny zawierać czytelny komunikat błędu w ciele JSON, np.:

```json
{
  "error": "opis błędu",
  "details": "dodatkowe szczegóły (opcjonalnie)"
}
```

## 7. Dalszy Rozwój

Plan API będzie ewoluował wraz z rozwojem aplikacji MedIQ. Nowe punkty końcowe i modyfikacje istniejących będą dokumentowane w tym pliku.