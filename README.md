# MedIQ 🚀

## Spis treści

- Opis projektu 📋
- Stos technologiczny 🛠️
- Uruchomienie lokalne 🚀
- Dostępne skrypty ⚙️
- Zakres projektu 🔍
- Status projektu 📈
- Licencja 📜

## Opis projektu

MedIQ to innowacyjna platforma internetowa wykorzystująca sztuczną inteligencję do analizy objawów pacjentów i łączenia użytkowników z najbardziej odpowiednimi specjalistami medycznymi. Dzięki prostemu opisowi swoich dolegliwości, pacjenci otrzymują spersonalizowane rekomendacje i szczegółowe profile lekarzy, co znacznie upraszcza proces znalezienia właściwego specjalisty.

Kluczowe funkcje obejmują:

- Analiza objawów oparta na AI z wykorzystaniem modelu Google: Gemma 3.27 🤖
- Kompleksowe funkcje CRUD do zarządzania profilami lekarzy 🏥
- Uwierzytelnianie użytkowników i zarządzanie profilami z wykorzystaniem Supabase 🔐
- Responsywny design zorientowany na urządzenia mobilne zapewniający dostępność na wszystkich urządzeniach 📱
- Zautomatyzowane testy i pipeline CI/CD zapewniające jakość kodu i efektywność wdrażania ✅

## Stos technologiczny

- **Frontend:** React 18+, TypeScript, Vite, React Router v6, Styled Components, Tailwind CSS, Lucide-react (ikony) oraz React hooks (useState, useEffect, itp.).
- **Backend:** Supabase do uwierzytelniania, PostgreSQL jako baza danych, Supabase Storage do przechowywania mediów oraz integracja z OpenAI API do analizy zapytań zdrowotnych.
- **DevOps i Testy:** GitHub Actions do CI/CD, Vitest i React Testing Library do testów jednostkowych, Cypress do testów end-to-end i komponentów, ESLint i Prettier do zapewnienia jakości kodu.

## Uruchomienie lokalne

1. **Klonowanie repozytorium:**

   ```sh
   git clone https://github.com/your-username/mediq.git
   cd mediq
   ```

2. **Instalacja zależności:**

   ```sh
   npm install
   ```

3. **Konfiguracja zmiennych środowiskowych:**

   ```sh
   cp .env .env.local
   ```

4. **Uruchomienie serwera deweloperskiego:**

   ```sh
   npm run dev
   ```

5. **Otwarcie przeglądarki:**
   Odwiedź [http://localhost:3000](http://localhost:3000) lub port określony przez Vite.

## Dostępne skrypty

### Podstawowe komendy deweloperskie

- **`npm run dev`**: Uruchamia serwer deweloperski Vite z hot module replacement.
- **`npm run build`**: Buduje aplikację w wersji produkcyjnej.
- **`npm run preview`**: Serwuje zbudowaną wersję produkcyjną lokalnie.
- **`npm run lint`**: Sprawdza problemy z jakością kodu przy użyciu ESLint.

### Testy jednostkowe i integracyjne (Vitest)

- **`npm test`**: Uruchamia wszystkie testy jednostkowe jednokrotnie.
- **`npm run test:watch`**: Uruchamia testy w trybie obserwacji (watch mode).
- **`npm run test:ui`**: Otwiera interfejs webowy Vitest do interaktywnego uruchamiania testów.
- **`npm run test:coverage`**: Uruchamia testy z raportem pokrycia kodu.

### Testy end-to-end i komponentów (Cypress)

- **`npm run cypress`**: Otwiera Cypress Test Runner w trybie interaktywnym.

### Kompleksowe testowanie

- **`npm run test:all`**: Uruchamia wszystkie testy (jednostkowe + e2e) sekwencyjnie.

## Zakres projektu

### Funkcje w zakresie

- Wyszukiwanie lekarzy oparte na AI na podstawie objawów wprowadzonych przez użytkownika.
- Pełne operacje CRUD do zarządzania profilami lekarzy (tworzenie, edycja, przeglądanie i usuwanie).
- Uwierzytelnianie użytkowników i zarządzanie sesjami z wykorzystaniem Supabase.
- Responsywny interfejs użytkownika zorientowany na urządzenia mobilne, zaprojektowany zgodnie z wytycznymi WCAG 2.1 AA.
- Zautomatyzowane testy (jednostkowe, integracyjne i e2e) oraz pipeline CI/CD poprzez GitHub Actions.
- Mechanizmy cache'owania do optymalizacji zapytań API.
- Optymalizacja wydajności z wykorzystaniem technik takich jak lazy loading i React.memo.

## Testy Jednostkowe i Integracyjne

Projekt zawiera kompleksowy zestaw testów wykorzystujących **Vitest** i **React Testing Library**:

### Testy Komponentów UI (`src/__tests__/components/`)

**Button Component** - Pełny zestaw testów sprawdzających:

- Renderowanie komponentu z różnymi propsami
- Obsługę eventów (onClick, hover, disabled)
- Warianty stylowania (primary, secondary, outlined, text, danger)
- Różne rozmiary przycisków (small, medium, large)
- Właściwości układu ($fullWidth)
- Integrację z systemem motywów Styled Components
- Responsywność i interakcje z użytkownikiem
- Wykorzystanie ThemeProvider i dostęp do kolorów motywu
- Testowanie CSS helpers i styled-components features
- Kompatybilność z różnymi elementami HTML (as prop)

### Testy Serwisów Backend (`src/__tests__/services/`)

**DoctorService** - Testy integracji z Supabase:

- Pobieranie listy lekarzy (`getDoctors()`)
- Pobieranie pojedynczego lekarza po ID (`getDoctorById()`)
- Obsługa błędów z bazy danych
- Mockowanie wywołań Supabase
- Walidacja struktury zapytań SQL
- Testowanie relacji z tabelami powiązanymi (addresses, ratings)

### Testy Integracji AI (`src/__tests__/lib/`)

**OpenAI Integration** - Testy analizy symptomów:

- Analiza zapytań zdrowotnych (`analyzeHealthQueryWithSpecialties()`)
- Parsowanie odpowiedzi z OpenAI API
- Obsługa błędów API (puste odpowiedzi, błędy sieci)
- Mockowanie zewnętrznych serwisów
- Walidacja struktury danych wyjściowych
- Testowanie logiki dopasowywania specjalizacji

### Konfiguracja Testów (`src/__tests__/setup.ts`)

- Konfiguracja środowiska testowego Vitest
- Globalne mocki (ResizeObserver, Supabase, zmienne środowiskowe)
- Rozszerzenia matcherów testing-library
- Automatyczne czyszczenie po testach
- Definicja zmiennych środowiskowych dla testów

### Testy End-to-End (`cypress/e2e/`)

**Główny Przepływ Użytkownika** (`main-user-flow.cy.ts`) - Kompleksowy test pokrywający:

- **Uwierzytelnianie**: Testowanie logowania użytkownika z walidacją danych
- **Wyszukiwanie AI**: Wprowadzanie objawów i weryfikacja analizy sztucznej inteligencji
- **Integracja z OpenAI**: Mockowanie i testowanie odpowiedzi API do analizy symptomów
- **Rekomendacje lekarzy**: Weryfikacja listy rekomendowanych specjalistów
- **Szczegóły lekarza**: Testowanie nawigacji do profilu lekarza i wyświetlania informacji
- **Przepływ nawigacji**: Weryfikacja przechodzenia między stronami
- **Wylogowywanie**: Testowanie zakończenia sesji użytkownika
- **Mockowanie danych**: Użycie fikstur testowych dla stabilnych wyników
- **Obsługa błędów**: Ignorowanie błędów cross-origin podczas testów

Test symuluje pełny przepływ użytkownika od logowania, przez wyszukiwanie lekarzy na podstawie objawów, aż po przeglądanie szczegółów i wylogowanie, zapewniając działanie wszystkich kluczowych funkcjonalności aplikacji.

### Testy Komponentów Cypress (`cypress/component/`)

**Component Testing** - Testy komponentów w izolacji:

- Interaktywne testy komponentu Button
- Testowanie stanów hover i focus
- Walidacja właściwości CSS w rzeczywistym środowisku przeglądarki
- Symulacja zdarzeń użytkownika

### Pokrycie Testowe

Testy obejmują:

- ✅ Komponenty UI i ich interakcje
- ✅ Serwisy komunikacji z bazą danych
- ✅ Integrację z zewnętrznymi API (OpenAI)
- ✅ Obsługę błędów i edge cases
- ✅ Mockowanie zależności zewnętrznych
- ✅ Testowanie funkcjonalności styled-components
- ✅ Pełny przepływ użytkownika end-to-end
- ✅ Integrację między komponentami w rzeczywistym środowisku

### Funkcje poza zakresem

- Funkcjonalności telemedycyny (konsultacje online).
- Systemy rezerwacji wizyt.
- Systemy przetwarzania płatności.
- Kompleksowa elektroniczna dokumentacja medyczna.
- Czat lub bezpośrednia komunikacja z lekarzami.
- Integracja z zewnętrznymi systemami medycznymi.
- Pełne aplikacje mobilne (tylko responsywny design web).
- Wsparcie wielojęzyczne (tylko język polski).
- Integracja z systemami ubezpieczeń zdrowotnych.
- Systemy zarządzania receptami.

## Status projektu

MedIQ jest obecnie w aktywnej fazie rozwoju jako MVP. Projekt koncentruje się na kluczowych funkcjonalnościach, w tym analizie opartej na AI, zarządzaniu lekarzami i zarządzaniu użytkownikami. Ciągłe monitorowanie wskaźników wydajności, jakości kodu i opinii użytkowników jest wdrożone, aby zapewnić szybkie i niezawodne usprawnienia.

## Licencja

Ten projekt jest licencjonowany na podstawie licencji MIT
