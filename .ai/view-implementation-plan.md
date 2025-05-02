# API Endpoint Implementation Plan: Create Doctor Endpoint (POST /doctors)

## 1. Przegląd punktu końcowego

Endpoint służy do tworzenia nowego profilu lekarza w systemie MedIQ. Funkcjonalność ta umożliwia administratorom dodawanie lekarzy do bazy danych, zapewniając spójne wstawianie danych głównych oraz powiązanych rekordów (specjalności, obszary ekspertyzy, adresy) w wielu tabelach.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** /doctors
- **Parametry:**
  - **Wymagane:** Brak parametrów w URL (wszystkie dane przekazywane są w ciele żądania)
  - **Opcjonalne:** Brak parametrów query
- **Request Body:** JSON zgodny z modelem `CreateDoctorCommand`:
  - `first_name` (string, wymagane)
  - `last_name` (string, wymagane)
  - `active` (boolean, wymagane)
  - `experience` (number, opcjonalne)
  - `education` (string, opcjonalne)
  - `bio` (string, opcjonalne)
  - `profile_image_url` (string, opcjonalne)
  - `specialties` (array of UUID, wymagane – identyfikatory specjalności)
  - `expertise_areas` (array of UUID, wymagane – identyfikatory obszarów ekspertyzy)
  - `addresses` (array of obiektów zgodnych z `CreateAddressCommand`, każdy zawiera np. street, city, state, postal_code, country)

## 3. Wykorzystywane typy

- **DTO i Command Modele:**
  - `CreateDoctorCommand` – dane wejściowe dla tworzenia lekarza.
  - `DoctorDTO` – pełny obiekt lekarza zwracany po operacji.
  - `CreateAddressCommand` – model dla danych adresowych powiązanych z lekarzem.

## 4. Szczegóły odpowiedzi

- **Pomyślna operacja:**
  - Status: **201 Created**
  - Treść: Obiekt JSON zgodny ze schematem `DoctorDTO` zawierający dane lekarza oraz jego relacje (specialties, expertise_areas, addresses)
- **Obsługa błędów:**
  - **400 Bad Request:** Niepoprawne lub niekompletne dane wejściowe.
  - **401 Unauthorized:** Użytkownik nie posiada ważnego tokena JWT lub nie ma roli administratora.
  - **500 Internal Server Error:** Wewnętrzny błąd serwera (np. problem podczas operacji transakcyjnych w bazie).

## 5. Przepływ danych

1. Klient wysyła żądanie POST /doctors z poprawnie sformatowanym ciałem żądania.
2. Middleware weryfikuje autentyczność tokena JWT i sprawdza, czy użytkownik ma rolę administratora.
3. Kontroler przekazuje dane do warstwy serwisowej (np. `DoctorService`).
4. `DoctorService`:
   - Dokonuje walidacji danych wejściowych zgodnie z wymaganiami.
   - Rozpoczyna transakcję:
     - Wstawia główny rekord do tabeli `doctors`.
     - Uzupełnia tabele relacyjne: `doctors_specialties` oraz `doctors_expertise_areas`.
     - Wstawia dane adresowe do tabeli `addresses`.
   - Zwraca obiekt `DoctorDTO` lub zgłasza wyjątek w razie błędu.
5. Kontroler wysyła odpowiedź do klienta ze statusem 201 Created oraz zwróconym obiektem JSON.

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie:** Wymagany jest token JWT; dostęp mają wyłącznie użytkownicy z odpowiednimi uprawnieniami (rola administratora).
- **Walidacja:** Dokładna walidacja danych wejściowych (sprawdzanie typów, zakresów, formatu UUID).
- **Polityki RLS:** Wykorzystanie Row Level Security do dodatkowej ochrony danych w bazie PostgreSQL.
- **Transmisja danych:** Wymagane szyfrowane połączenie HTTPS.

## 7. Obsługa błędów

- **400 Bad Request:** Zwracany, gdy walidacja danych wejściowych zawiedzie (np. brak wymaganych pól lub błędny format).
- **401 Unauthorized:** Brak lub nieprawidłowy token JWT, albo brak wymaganej roli.
- **500 Internal Server Error:** Nieprzewidziane błędy serwera; przy krytycznych błędach warto logować szczegóły (np. z wykorzystaniem narzędzia Winston) do monitoringu.

## 8. Rozważania dotyczące wydajności

- **Transakcje:** Użycie transakcji bazodanowych zapewni spójność danych podczas zapisu wielu rekordów.
- **Indeksy:** Wskazane jest wykorzystywanie indeksów na kluczowych polach tabeli `doctors` i tabelach relacyjnych.
- **Optymalizacja operacji INSERT:** Upewnienie się, że operacje masowe na tabelach pośredniczących są zoptymalizowane.

## 9. Etapy wdrożenia

1. **Analiza i projektowanie:**
   - Przegląd specyfikacji API, struktury bazy danych oraz definicji typów.
   - Określenie relacji między tabelami oraz modelu domenowego lekarza.
2. **Implementacja middleware:**
   - Zapewnienie poprawności logiki uwierzytelniania (sprawdzenie tokena JWT oraz uprawnień administratora).
3. **Tworzenie warstwy kontrolera:**
   - Utworzenie endpointu POST /doctors, który odbiera dane i przekazuje je do serwisu.
4. **Implementacja warstwy serwisowej:**
   - Utworzenie `DoctorService` odpowiedzialnego za:
     - Walidację danych wejściowych.
     - Wykonanie operacji transakcyjnych na tabelach `doctors`, `doctors_specialties`, `doctors_expertise_areas` oraz `addresses`.
5. **Testy jednostkowe i integracyjne:**
   - Opracowanie testów przy użyciu np. Jest, aby przetestować logikę serwisu oraz kontrolera.
   - Testy end-to-end (Cypress) w celu symulacji rzeczywistych scenariuszy użytkowników.
6. **Dokumentacja i Code Review:**
   - Przygotowanie dokumentacji API oraz przeprowadzenie code review zgodnie z wewnętrznymi standardami.
7. **Deploy i monitoring:**
   - Wdrożenie przy użyciu CI/CD (GitHub Actions) i konfiguracja monitoringu oraz logowania (np. Winston).
8. **Optymalizacja:**
   - Wprowadzenie ewentualnych usprawnień na podstawie feedbacku oraz wyników testów w środowisku produkcyjnym.
