# API Endpoint Implementation Plan: POST /doctors

## 1. Przegląd punktu końcowego

Endpoint umożliwia utworzenie nowego profilu lekarza. Operacja ta jest dostępna tylko dla użytkowników o roli administratora. Przyjmuje dane lekarza wraz z powiązanymi relacjami, takimi jak specjalizacje, obszary ekspertyzy oraz adresy, i tworzy rekord w bazie danych.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** /doctors
- **Parametry:**
  - **Wymagane:**  
    - `first_name` (string)
    - `last_name` (string)
    - `active` (boolean)
    - `specialties` (string[]) – lista identyfikatorów specjalizacji
    - `expertise_areas` (string[]) – lista identyfikatorów obszarów ekspertyzy
    - `addresses` (CreateAddressCommand[]) – obiekty z danymi adresowymi
  - **Opcjonalne:**  
    - `experience` (number)
    - `education` (string)
    - `bio` (string)
    - `profile_image_url` (string)
- **Request Body:**  
  Struktura zgodna z typem `CreateDoctorCommand` zdefiniowanym w pliku `types.ts`.

## 3. Wykorzystywane typy

- **CreateDoctorCommand:**  
  Typ definiowany w `types.ts`, który jest rozszerzeniem modelu DoctorInsert z dodatkowymi relacjami i danymi adresowymi.
- **DoctorDTO:**  
  DTO dla zwróconego lekarza wraz z rozbudowanymi powiązaniami, tj. specialties, expertise_areas oraz addresses.

## 4. Przepływ danych

1. **Autoryzacja:**  
   - Weryfikacja tokenu JWT w nagłówku `Authorization`.
   - Sprawdzenie, czy użytkownik posiada rolę administratora.
2. **Walidacja danych:**  
   - Walidacja pól wymaganych (first_name, last_name, active, specialties, expertise_areas, addresses).
   - Sprawdzenie formatu danych (np. UUID, typy danych).
3. **Przetwarzanie żądania:**  
   - Przekazanie żądania do warstwy serwisowej (doctorService), która obsługuje logikę biznesową.
   - Przeprowadzenie operacji w ramach transakcji, aby utworzyć rekord lekarza oraz powiązane rekordy w tabelach relacyjnych.
4. **Odpowiedź:**  
   - Zwrócenie pełnego obiektu lekarza jako `DoctorDTO` z przypisanymi specjalizacjami, obszarami ekspertyzy oraz adresami.
   - Status HTTP 201 Created przy pomyślnym utworzeniu.

## 5. Względy bezpieczeństwa

- **Uwierzytelnianie:**  
  - Wymaganie obecności tokenu JWT.
- **Autoryzacja:**  
  - Weryfikacja roli użytkownika (tylko administrator może utworzyć lekarza).
- **Walidacja wejściowa:**  
  - Dokładna walidacja danych wejściowych w celu zapobiegania atakom (np. SQL Injection, XSS).
- **Transakcje:**  
  - Użycie transakcji przy wprowadzaniu wielu powiązanych rekordów w celu zapewnienia integralności danych.

## 6. Obsługa błędów

- **400 Bad Request:**  
  - Zwracanie błędu w przypadku nieprawidłowych lub niekompletnych danych wejściowych.
- **401 Unauthorized:**  
  - Zwracanie błędu, gdy brak jest ważnego tokenu JWT lub użytkownik nie ma odpowiednich uprawnień.
- **500 Internal Server Error:**  
  - Zwracanie błędu przy nieoczekiwanych błędach po stronie serwera (np. błąd podczas komunikacji z bazą danych).
- **Logowanie:**  
  - Rejestrowanie szczegółów błędów przy użyciu odpowiedniego mechanizmu loggera oraz opcjonalnie zapisywanie błędów do dedykowanej tabeli.

## 7. Rozważania dotyczące wydajności

- **Transakcje:**  
  - Użycie transakcji do grupowania operacji insertów dla lekarza oraz powiązanych rekordów, aby zminimalizować liczbę zapytań do bazy.
- **Indeksowanie:**  
  - Wykorzystanie indeksów na tabelach (np. pełnotekstowy indeks na lekarzach) dla szybkiego wyszukiwania.
- **Asynchroniczne przetwarzanie:**  
  - W przyszłości rozważyć asynchroniczne przetwarzanie operacji, które dotyczą przetwarzania dużej ilości danych lub złożonej logiki biznesowej.

## 8. Etapy wdrożenia

1. **Przygotowanie autoryzacji:**  
   - Implementacja middleware do weryfikacji tokenu JWT oraz sprawdzania roli użytkownika.
2. **Walidacja wejścia:**  
   - Utworzenie funkcji walidacyjnych dla danych wejściowych zgodnych z `CreateDoctorCommand`.
3. **Implementacja warstwy serwisowej:**  
   - Wyodrębnienie logiki do serwisu (doctorService) obejmującego:
     - Walidację danych.
     - Obsługę transakcji przy tworzeniu rekordu lekarza.
     - Integrację z bazą danych oraz wstawianie powiązanych rekordów (specialties, expertise_areas, addresses).
4. **Implementacja endpointu:**  
   - Utworzenie kontrolera/handlera dla POST /doctors, który:
     - Odbierze żądanie.
     - Wykona walidację oraz autoryzację.
     - Wywoła doctorService.createDoctor().
     - Zwróci odpowiedź z kodem 201 Created oraz utworzonym obiektem `DoctorDTO`.
5. **Testy:**  
   - Implementacja testów jednostkowych i e2e (np. przy użyciu Jest, React Testing Library oraz Cypress), aby zweryfikować poprawność działania endpointu.
6. **Logowanie i monitoring:**  
   - Wdrożenie mechanizmu logowania błędów oraz monitoringu operacji API.
7. **Review i wdrożenie:**  
   - Code review, testy integracyjne oraz ostateczne wdrożenie w środowisku produkcyjnym za pomocą CI/CD (GitHub Actions).
