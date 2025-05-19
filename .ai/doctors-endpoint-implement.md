# API Endpoint Implementation Plan: POST /doctors

## 1. Cel

Ten dokument opisuje plan implementacji dla punktu końcowego API `POST /doctors`, który umożliwia tworzenie nowych rekordów lekarzy w systemie MedIQ.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** `/rest/v1/rpc/create_doctor` (lub bezpośrednio do tabeli `doctors` z odpowiednimi RLS, jeśli nie używamy funkcji RPC opakowującej logikę biznesową wstawiania powiązań)
  - *Uwaga: `doctorService.ts` używa `supabase.rpc('create_doctor', ...)`.*
- **Request Body:**  
  Struktura zgodna z typem `CreateDoctorCommand` zdefiniowanym w pliku `src/types/dto.ts`. Główne pola to:
  - `first_name` (string, wymagane)
  - `last_name` (string, wymagane)
  - `specialties` (string, wymagane - np. "kardiolog, internista")
  - `experience` (number, opcjonalne)
  - `education` (string, opcjonalne)
  - `bio` (string, opcjonalne)
  - `profile_image_url` (string, opcjonalne)
  - `active` (boolean, opcjonalne, domyślnie true)
  - `addresses` (tablica obiektów `CreateAddressCommand`, opcjonalne)
    - Każdy obiekt adresu zawiera: `street`, `city`, `state`, `postal_code`, `country`, `is_primary` (opcjonalne).

## 3. Wykorzystywane typy

- **`CreateDoctorCommand`:**  
  Typ zdefiniowany w `src/types/dto.ts`. Reprezentuje dane wejściowe potrzebne do utworzenia nowego lekarza. Jest to rozszerzenie typu `DoctorInsert` (generowanego przez Supabase na podstawie schematu tabeli `doctors`), z pominięciem pól `id`, `created_at`, `updated_at`, oraz z dodaniem pola `addresses` (tablica `CreateAddressCommand`) do obsługi powiązanych adresów. Pole `specialties` jest typu `string`.
- **`DoctorDTO`:**  
  Typ zdefiniowany w `src/types/dto.ts`. Reprezentuje obiekt lekarza zwracany przez API po pomyślnym utworzeniu. Zawiera pełne dane lekarza, w tym `id`, `first_name`, `last_name`, `specialties` (jako string), `experience`, `education`, `bio`, `profile_image_url`, `active`, a także zagnieżdżone dane powiązane, takie jak `addresses` (tablica `Address`) i `ratings` (tablica `Rating`).
  *Uwaga: `expertise_areas` (obszary ekspertyzy) nie są obecnie częścią `DoctorDTO` ani `CreateDoctorCommand`.*

## 4. Przepływ danych

1.  **Autoryzacja:**
    - Weryfikacja tokenu JWT w nagłówku `Authorization`.
    - Sprawdzenie, czy użytkownik posiada rolę administratora (zgodnie z logiką w funkcji SQL `create_doctor` lub politykami RLS).
2.  **Walidacja danych:**
    - Walidacja pól wymaganych w `CreateDoctorCommand` (np. `first_name`, `last_name`, `specialties`).
    - Sprawdzenie formatu danych (np. typy danych, struktura tablicy `addresses`). Walidacja powinna być realizowana zarówno na poziomie frontendu (wstępna), jak i backendu (ostateczna, np. przez funkcję Supabase lub ograniczenia bazy danych).
3.  **Przetwarzanie żądania:**
    - Żądanie jest przekazywane do metody `createDoctor` w `DoctorService`.
    - `DoctorService` wywołuje funkcję RPC Supabase o nazwie `create_doctor`, przekazując obiekt `command` (typu `CreateDoctorCommand`) jako argument `doctor_data`.
    - Funkcja SQL `create_doctor` (z migracji `20250516000002_add_doctor_functions.sql` lub jej zaktualizowanej wersji) powinna:
        - Utworzyć nowy rekord w tabeli `doctors`.
        - Dla każdego obiektu w tablicy `addresses` w `doctor_data`, utworzyć powiązany rekord w tabeli `addresses`.
        - Operacje te powinny być wykonane w ramach transakcji, aby zapewnić spójność danych.
    - *Uwaga: Istnieje rozbieżność. Najnowsza migracja SQL (`20250526000000_update_all_doctor_functions.sql`) modyfikuje `create_doctor` tak, że przyjmuje ona indywidualne parametry i nie obsługuje bezpośrednio zagnieżdżonych adresów w przekazywanym JSON, w przeciwieństwie do wcześniejszej wersji i oczekiwań `DoctorService`. Ta dokumentacja opisuje zamierzony przepływ zgodny z `DoctorService`.*
4.  **Odpowiedź:**
    - Po pomyślnym utworzeniu lekarza i powiązanych danych, `DoctorService` pobiera pełny obiekt nowo utworzonego lekarza (wraz z adresami i ocenami) za pomocą metody `getDoctorById`.
    - Zwracany jest obiekt `DoctorDTO`.
    - Status HTTP `201 Created`.
    - W przypadku błędu (np. walidacji, autoryzacji, błędu bazy danych), zwracany jest odpowiedni kod statusu HTTP (np. 400, 401, 403, 500) wraz z komunikatem błędu.

## 5. Względy bezpieczeństwa

- **Uwierzytelnianie:**
  - Wymaganie obecności ważnego tokenu JWT.
- **Autoryzacja:**
  - Weryfikacja roli użytkownika. Tylko użytkownicy z rolą 'administrator' (lub inną odpowiednio skonfigurowaną) mogą tworzyć nowych lekarzy. Jest to egzekwowane przez logikę wewnątrz funkcji SQL `create_doctor` lub przez polityki RLS na tabeli `doctors`.
- **Walidacja wejściowa:**
  - Dokładna walidacja wszystkich danych wejściowych (zarówno na poziomie aplikacji, jak i w bazie danych) w celu zapobiegania atakom (np. SQL Injection, XSS) oraz zapewnienia integralności danych. Użycie Zod do walidacji schematów na poziomie TypeScript jest zalecane.
- **Ochrona przed nadużyciami:**
  - Rozważenie mechanizmów ograniczania liczby żądań (rate limiting), jeśli dotyczy.
- **Logowanie:**
  - Logowanie prób utworzenia lekarza, zwłaszcza nieudanych, może być przydatne do celów audytu i bezpieczeństwa.
