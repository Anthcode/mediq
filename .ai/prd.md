# Dokument wymagań produktu (PRD) - MedIQ

## 1. Przegląd produktu

MedIQ to platforma internetowa, która wykorzystuje sztuczną inteligencję do analizy symptomów pacjentów i łączy ich z odpowiednimi lekarzami specjalistami. Aplikacja pomaga użytkownikom znaleźć lekarzy, którzy najlepiej odpowiadają ich potrzebom zdrowotnym, na podstawie analizy opisanych symptomów i dolegliwości.

Platforma oferuje:

- Inteligentny system wyszukiwania lekarzy na podstawie opisu symptomów
- Analizę zapytań zdrowotnych za pomocą AI (OpenRouter API z modelem Gemma)
- Profile lekarzy ze szczegółowymi informacjami  
- System autentykacji użytkowników z potwierdzeniem email (Supabase)
- Zarządzanie profilem użytkownika z historią wyszukiwań
- Pełny system CRUD dla zarządzania lekarzami (tylko dla administratorów)
- System ról użytkowników (user, doctor, moderator, administrator)
- Responsywny interfejs użytkownika z podejściem mobile-first

Celem produktu jest uproszczenie procesu znalezienia odpowiedniego specjalisty medycznego poprzez eliminację konieczności samodzielnego diagnozowania i określania potrzebnej specjalizacji przez pacjenta.

Główne grupy docelowe:

- Pacjenci poszukujący specjalistów medycznych
- Administratorzy systemu zarządzający bazą lekarzy
- Lekarze z dostępem do panelu lekarza (przyszła funkcjonalność)
- Moderatorzy zarządzający treściami

## 2. Problem użytkownika

Obecny proces poszukiwania odpowiedniego lekarza specjalisty jest złożony i frustrujący dla pacjentów z kilku powodów:

1. Niepewność co do wyboru specjalizacji - pacjenci często nie wiedzą, jakiego rodzaju specjalisty potrzebują na podstawie swoich objawów.

2. Brak kontekstowej rekomendacji - tradycyjne wyszukiwarki lekarzy wymagają od pacjenta określenia specjalizacji z góry, bez analizy ich rzeczywistych potrzeb zdrowotnych.

3. Nadmiar informacji - pacjenci napotykają na mnóstwo ogólnych informacji o lekarzach bez zrozumienia, który z nich najlepiej pasuje do ich konkretnego problemu.

4. Brak przejrzystości - trudno porównać lekarzy pod kątem ich doświadczenia w leczeniu konkretnych objawów lub chorób.

5. Czasochłonny proces - samodzielne badanie, które specjalizacje są odpowiednie dla danych symptomów, a następnie wyszukiwanie lekarzy z danej specjalizacji zajmuje dużo czasu.

6. Nieefektywność - pacjenci często trafiają do niewłaściwych specjalistów, co prowadzi do opóźnień w diagnozie i leczeniu oraz dodatkowych kosztów.

MedIQ rozwiązuje te problemy, oferując intuicyjny interfejs, w którym pacjenci mogą po prostu opisać swoje objawy i otrzymać listę rekomendowanych specjalistów, którzy najlepiej odpowiadają ich potrzebom zdrowotnym.

## 3. Stos technologiczny

### 3.1. Frontend

- **React 18+** z TypeScript dla nowoczesnego interfejsu opartego na komponentach funkcyjnych
- **Vite** jako szybki bundler i serwer deweloperski
- **React Router v6** do zarządzania nawigacją w aplikacji
- **Styled Components** z ThemeProvider do spójnego stylowania komponentów
- **Tailwind CSS** jako uzupełnienie stylowania dla szybkiego prototypowania
- **Lucide-react** jako biblioteka ikon dla spójnego interfejsu użytkownika
- **React hooks** (useState, useEffect, useCallback, useMemo, useId, useContext) dla skutecznego zarządzania stanem i optymalizacji
- **React Context API** do zarządzania globalnym stanem aplikacji i autentykacją
- **React.lazy** i **Suspense** do podziału kodu i poprawy wydajności ładowania
- **React Testing Library** i **Vitest** do testów komponentów
- **date-fns** do formatowania dat

### 3.2. Backend

- **Supabase** jako kompleksowe rozwiązanie backendowe:
  - System autentykacji i autoryzacji użytkowników z potwierdzeniem email
  - Baza danych PostgreSQL z automatycznie generowanym REST API
  - Row Level Security (RLS) do zabezpieczenia dostępu do danych
  - Przechowywanie plików (zdjęcia lekarzy, dokumenty)
  - Funkcje bazodanowe do złożonych operacji
- **OpenRouter API** z modelem Gemma do analizy zapytań zdrowotnych użytkowników

### 3.3. DevOps

- **GitHub Actions** do automatyzacji CI/CD
- **Cloudflare Pages** jako platforma deploymentu
- **Vitest** do testów jednostkowych
- **Cypress** do testów end-to-end i komponentowych
- **ESLint** i **Prettier** do zapewnienia jakości kodu
- **TypeScript** do statycznego typowania

## 4. Wymagania funkcjonalne

### 4.1. System autentykacji i autoryzacji

- Rejestracja użytkownika z polami: imię, nazwisko, email, hasło
- Potwierdzenie rejestracji przez email
- Logowanie użytkownika za pomocą email i hasła
- Wylogowywanie użytkownika
- System ról użytkowników (user, doctor, moderator, administrator)
- Dedykowana tabela `user_roles` do zarządzania rolami
- Komponenty RoleBasedRoute i PermissionGate do kontroli dostępu
- Zabezpieczenie ścieżek dostępu według ról użytkowników
- Panel administracyjny dostępny tylko dla administratorów
- Przyszły panel lekarza dla użytkowników z rolą 'doctor'
- Automatyczne tworzenie profilu użytkownika po rejestracji

### 4.2. Wyszukiwanie lekarzy z analizą AI

- Pole wyszukiwania dostępne tylko dla zalogowanych użytkowników
- Analiza AI wprowadzonych symptomów przy użyciu OpenRouter API (model Gemma)
- Identyfikacja symptomów i dopasowanie do dostępnych specjalizacji
- Wyświetlanie lekarzy posortowanych według procentowego dopasowania
- Panel analizy AI pokazujący:
  - Wprowadzone zapytanie
  - Zidentyfikowane symptomy
  - Sugerowane specjalizacje z procentowym dopasowaniem
  - Uzasadnienie dla każdej specjalizacji
- Automatyczne zapisywanie historii wyszukiwań
- Dynamiczne pobieranie listy specjalizacji z bazy danych

### 4.3. System zarządzania lekarzami (CRUD)

- **Odczyt (Read)**:
  - Lista wszystkich lekarzy z podstawowymi informacjami
  - Szczegółowa strona profilu lekarza
  - Filtrowanie i wyszukiwanie lekarzy
  - Karty lekarzy z informacjami i zdjęciem profilowym

- **Tworzenie (Create)** - tylko administratorzy:
  - Formularz dodawania nowego lekarza
  - Pola: imię, nazwisko, specjalizacje (tekst), doświadczenie, edukacja, bio, zdjęcie
  - Możliwość dodania wielu adresów
  - Walidacja danych w czasie rzeczywistym

- **Aktualizacja (Update)** - tylko administratorzy:
  - Edycja wszystkich danych lekarza
  - Zarządzanie adresami (dodawanie, edycja, usuwanie)
  - Aktualizacja zdjęcia profilowego

- **Usuwanie (Delete)** - tylko administratorzy:
  - Soft delete (ustawienie flagi active na false)
  - Modal potwierdzenia przed usunięciem
  - Automatyczne ukrycie nieaktywnych lekarzy

### 4.4. Zarządzanie profilem użytkownika

- **Zakładka "Dane profilu"**:
  - Wyświetlanie i edycja imienia i nazwiska
  - Wyświetlanie roli użytkownika (tylko odczyt)
  - Walidacja formularza w czasie rzeczywistym

- **Zakładka "Historia wyszukiwań"**:
  - Lista wszystkich wyszukiwań użytkownika
  - Wyświetlanie zapytania, znalezionych specjalizacji i daty
  - Możliwość ponownego wyszukania z historii
  - Usuwanie pojedynczych wpisów
  - Czyszczenie całej historii z potwierdzeniem

### 4.5. Panel administracyjny

- Dashboard z statystykami:
  - Liczba lekarzy w bazie
  - Liczba unikalnych specjalizacji
  - Liczba nowych użytkowników (ostatnie 30 dni)
- Zarządzanie lekarzami (pełny CRUD)
- Nawigacja boczna z sekcjami
- Dostęp tylko dla użytkowników z rolą 'administrator'

### 4.6. System testów i CI/CD

- **Testy jednostkowe** (Vitest):
  - Testy komponentów React
  - Testy serwisów i funkcji pomocniczych
  - Mockowanie zewnętrznych API
  - Pokrycie kodu minimum 70%

- **Testy E2E** (Cypress):
  - Główny przepływ użytkownika (logowanie, wyszukiwanie, przeglądanie)
  - Testy komponentowe
  - Mockowanie odpowiedzi Supabase i OpenRouter

- **CI/CD** (GitHub Actions):
  - Automatyczne uruchamianie testów przy każdym push
  - Kontrola jakości kodu (ESLint)
  - Build aplikacji
  - Deployment do Cloudflare Pages
  - Preview deployments dla pull requestów

### 4.7. Optymalizacja wydajności

- React.memo() dla komponentów DoctorCard i DoctorForm
- Lazy loading dla stron i dużych komponentów
- Debouncing w wyszukiwarce
- Optymalizacja zapytań do bazy danych
- Cachowanie wyników analizy AI w przyszłości

### 4.8. Responsywność i dostępność

- Podejście mobile-first we wszystkich komponentach
- Breakpointy: xs (0px), sm (600px), md (960px), lg (1280px), xl (1920px)
- Użycie semantic HTML
- Atrybuty ARIA gdzie potrzebne
- Kontrast kolorów zgodny z WCAG
- Wsparcie dla nawigacji klawiaturą

## 5. Granice produktu

### Co jest zaimplementowane

- ✅ Wyszukiwanie lekarzy z analizą AI (OpenRouter/Gemma)
- ✅ System autentykacji z potwierdzeniem email (Supabase)
- ✅ Pełny CRUD dla lekarzy (administratorzy)
- ✅ Profile lekarzy z adresami
- ✅ Historia wyszukiwań użytkownika
- ✅ System ról użytkowników
- ✅ Panel administracyjny z dashboardem
- ✅ Responsywny interfejs mobile-first
- ✅ Testy jednostkowe (Vitest) i E2E (Cypress)
- ✅ CI/CD z GitHub Actions
- ✅ Deployment na Cloudflare Pages

### Co nie jest zaimplementowane

- ❌ System ocen i opinii o lekarzach (tabela istnieje, brak UI)
- ❌ Ulubieni lekarze
- ❌ Funkcjonalny panel lekarza
- ❌ Telemedycyna
- ❌ System rezerwacji wizyt
- ❌ System płatności
- ❌ Dokumentacja medyczna
- ❌ Czat z lekarzami
- ❌ Integracje z zewnętrznymi systemami medycznymi
- ❌ Aplikacja mobilna
- ❌ Wielojęzyczność
- ❌ Powiadomienia
- ❌ Zaawansowane filtrowanie lekarzy

## 6. Struktura bazy danych

### Główne tabele

- **profiles**: Dane użytkowników (id, email, first_name, last_name)
- **user_roles**: Role użytkowników (user_id, role)
- **doctors**: Dane lekarzy (id, first_name, last_name, specialties jako tekst, experience, education, bio, profile_image_url, active)
- **addresses**: Adresy lekarzy (id, doctor_id, street, city, state, postal_code, country)
- **search_history**: Historia wyszukiwań (id, user_id, query, specialties jako tablica, created_at)
- **ratings**: Oceny lekarzy (nieużywane w UI)

### Polityki RLS

- Odczyt lekarzy i adresów dostępny dla wszystkich
- Modyfikacja tylko dla administratorów
- Historia wyszukiwań widoczna tylko dla właściciela
- Profile użytkowników publiczne do odczytu

## 7. Metryki sukcesu

### Metryki techniczne (aktualne)

1. **Wydajność**:
   - Czas ładowania strony < 3s
   - Czas analizy AI < 5s (zależny od OpenRouter)
   - Responsywność na urządzeniach mobilnych

2. **Jakość kodu**:
   - Pokrycie testami jednostkowymi > 70%
   - Brak błędów TypeScript
   - Przechodzące testy E2E

3. **Niezawodność**:
   - Pomyślne deploymenty przez CI/CD
   - Obsługa błędów API
   - Graceful degradation przy niedostępności AI

### Metryki biznesowe (przyszłe)

1. **Zaangażowanie użytkowników**:
   - Liczba zarejestrowanych użytkowników
   - Średnia liczba wyszukiwań na użytkownika
   - Retencja użytkowników

2. **Skuteczność AI**:
   - Trafność rekomendacji specjalizacji
   - Zadowolenie użytkowników z wyników

3. **Rozwój bazy**:
   - Liczba lekarzy w systemie
   - Pokrycie specjalizacji medycznych

## 8. Plan rozwoju

### Faza 1 (Zrealizowana)

- ✅ MVP z podstawowymi funkcjonalnościami
- ✅ Integracja AI do analizy symptomów
- ✅ System autentykacji i autoryzacji
- ✅ CRUD dla lekarzy
- ✅ Historia wyszukiwań

### Faza 2 (W trakcie)

- 🔄 Optymalizacja wydajności
- 🔄 Rozszerzenie testów
- 🔄 Ulepszenia UX na podstawie feedbacku

### Faza 3 (Planowana)

- ⏳ System ocen i opinii
- ⏳ Ulubieni lekarze
- ⏳ Panel lekarza
- ⏳ Zaawansowane filtrowanie
- ⏳ Powiadomienia email

### Faza 4 (Przyszłość)

- ⏳ System rezerwacji wizyt
- ⏳ Integracja z kalendarzami
- ⏳ Aplikacja mobilna
- ⏳ Wielojęzyczność
