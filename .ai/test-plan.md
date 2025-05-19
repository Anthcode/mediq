# Plan Testów MedIQ

## 1. Wprowadzenie i cele testowania

### 1.1 Cel dokumentu

Niniejszy dokument przedstawia kompleksowy plan testów dla aplikacji MedIQ - platformy wykorzystującej sztuczną inteligencję do analizy objawów pacjentów i łączenia ich z odpowiednimi lekarzami specjalistami. Plan określa strategie, podejście, zasoby i harmonogram niezbędne do przeprowadzenia efektywnych testów.

### 1.2 Cele testowania

- Zapewnienie wysokiej jakości i niezawodności aplikacji MedIQ
- Weryfikacja poprawności działania kluczowych funkcjonalności, szczególnie analizy AI objawów zdrowotnych
- Walidacja zabezpieczeń i mechanizmów autoryzacji
- Potwierdzenie zgodności z wymaganiami biznesowymi i technicznymi
- Zapewnienie optymalnej wydajności aplikacji
- Weryfikacja dostępności aplikacji zgodnie ze standardami WCAG 2.1 AA

## 2. Zakres testów

### 2.1 Funkcjonalności objęte testami

#### Krytyczne (Priorytet wysoki)

- Analiza objawów zdrowotnych przy użyciu API OpenAI
- Wyszukiwanie lekarzy na podstawie analizy symptomów
- Pełny CRUD lekarzy (dodawanie, edycja, wyświetlanie, usuwanie)
- System autentykacji i autoryzacji użytkowników
- Zabezpieczenie ścieżek dostępu i zarządzanie rolami (użytkownik, administrator)

#### Istotne (Priorytet średni)

- Zarządzanie profilem użytkownika
- Historia wyszukiwań użytkownika
- Wyświetlanie szczegółowych informacji o lekarzach
- Panel administracyjny (zarządzanie danymi lekarzy)
- Responsywność interfejsu użytkownika

#### Pomocnicze (Priorytet niski)

- Optymalizacja wydajności aplikacji
- Mechanizmy cachowania zapytań
- Wizualna spójność interfejsu

### 2.2 Funkcjonalności wyłączone z testów

Zgodnie z dokumentacją projektu, poza zakresem testów są funkcjonalności niezaimplementowane w aplikacji:

- Telemedycyna (konsultacje online)
- System rezerwacji wizyt
- Przetwarzanie płatności
- Dokumentacja medyczna
- Komunikacja z lekarzami
- Integracja z zewnętrznymi systemami medycznymi
- Aplikacje mobilne (tylko responsywność web)
- Wielojęzyczność (tylko język polski)
- Integracja z systemami ubezpieczeń zdrowotnych
- System zarządzania receptami

## 3. Typy testów

### 3.1 Testy jednostkowe

- **Narzędzia**: Jest, React Testing Library
- **Zakres**:
  - Komponenty React (Button, Input, Card, etc.)
  - Funkcje analizy objawów zdrowotnych
  - Serwisy (DoctorService, UserService, SearchHistoryService)
  - Walidatory danych
  - Niestandardowe hooki React
- **Techniki mockowania**:
  - `jest.mock()` do izolacji modułów od zewnętrznych zależności
  - `jest.spyOn()` do śledzenia i modyfikacji zachowania funkcji
  - Automatyczne mockowanie odpowiedzi API (OpenAI, Supabase)

### 3.2 Testy integracyjne

- **Narzędzia**: Jest, React Testing Library
- **Zakres**:
  - Integracja komponentów UI (formularze, panele wyszukiwania)
  - Integracja z AuthContext
  - Integracja z API Supabase
  - Integracja z API OpenAI
  - Przepływ danych między komponentami
- **Podejście**: Mockowanie zewnętrznych API, testowanie rzeczywistych interakcji między komponentami

### 3.3 Testy end-to-end (E2E)

- **Narzędzia**: Cypress
- **Zakres**:
  - Rejestracja i logowanie użytkownika
  - Wyszukiwanie lekarzy na podstawie symptomów
  - Przeglądanie profili lekarzy
  - Zarządzanie profilem użytkownika
  - Zarządzanie lekarzami (CRUD) przez administratora
  - Weryfikacja zabezpieczonych ścieżek
- **Środowisko**: Dedykowane środowisko testowe z instancją Supabase

### 3.4 Testy bezpieczeństwa

- **Narzędzia**: Custom scripts, OWASP ZAP
- **Zakres**:
  - Weryfikacja JWT i mechanizmów autoryzacji
  - Testy polityk Row Level Security (RLS) w Supabase
  - Weryfikacja zabezpieczeń przed atakami XSS i CSRF
  - Testowanie ochrony kluczy API i zmiennych środowiskowych
  - Weryfikacja bezpiecznego przechowywania danych sesji

### 3.5 Testy wydajnościowe

- **Narzędzia**: Lighthouse, custom scripts
- **Zakres**:
  - Czas ładowania strony (cel: poniżej 2 sekund)
  - Czas analizy zapytań API OpenAI (cel: poniżej 3 sekund)
  - Wydajność renderowania list lekarzy
  - Skuteczność mechanizmów cachowania
  - Optymalizacja renderowania z React.memo() i useMemo

### 3.6 Testy dostępności

- **Narzędzia**: Lighthouse, Axe
- **Zakres**:
  - Zgodność ze standardami WCAG 2.1 AA
  - Kontrast kolorów i czytelność tekstu
  - Dostępność z klawiatury
  - Poprawność atrybutów ARIA
  - Alternatywne teksty dla elementów graficznych

## 4. Scenariusze testowe dla kluczowych funkcjonalności

### 4.1 Analiza objawów zdrowotnych przez AI

1. **TS-AI-001**: Analiza podstawowych objawów
   - **Warunki wstępne**: Zalogowany użytkownik
   - **Kroki**: Wprowadź "ból głowy i zawroty głowy" w wyszukiwarkę
   - **Oczekiwany wynik**: System identyfikuje objawy i sugeruje odpowiednie specjalizacje (neurolog, okulista)

2. **TS-AI-002**: Analiza złożonych objawów
   - **Warunki wstępne**: Zalogowany użytkownik
   - **Kroki**: Wprowadź "ból w klatce piersiowej, duszności, zmęczenie"
   - **Oczekiwany wynik**: System poprawnie identyfikuje objawy i ranguje specjalizacje według trafności

3. **TS-AI-003**: Obsługa błędów API
   - **Warunki wstępne**: Zalogowany użytkownik, niedostępne API OpenAI
   - **Kroki**: Wprowadź dowolne objawy
   - **Oczekiwany wynik**: Przyjazny komunikat błędu z sugestią ponownej próby

### 4.2 Autentykacja i zabezpieczenia

1. **TS-AUTH-001**: Rejestracja nowego użytkownika
   - **Warunki wstępne**: Niezalogowany użytkownik
   - **Kroki**: Wypełnij formularz rejestracji poprawnymi danymi
   - **Oczekiwany wynik**: Utworzenie konta i przekierowanie do głównej strony

2. **TS-AUTH-002**: Dostęp do zabezpieczonych zasobów
   - **Warunki wstępne**: Niezalogowany użytkownik
   - **Kroki**: Próba dostępu do /profile przez bezpośredni URL
   - **Oczekiwany wynik**: Przekierowanie na stronę logowania

3. **TS-AUTH-003**: Dostęp do zasobów administratora
   - **Warunki wstępne**: Zalogowany zwykły użytkownik
   - **Kroki**: Próba dostępu do /admin/doctors przez bezpośredni URL
   - **Oczekiwany wynik**: Przekierowanie lub komunikat o braku uprawnień

### 4.3 Zarządzanie lekarzami (CRUD)

1. **TS-DOC-001**: Dodawanie nowego lekarza
   - **Warunki wstępne**: Zalogowany administrator
   - **Kroki**: Wypełnij formularz dodawania lekarza ze specjalizacjami i adresami
   - **Oczekiwany wynik**: Utworzenie profilu lekarza w bazie danych

2. **TS-DOC-002**: Edycja istniejącego lekarza
   - **Warunki wstępne**: Zalogowany administrator, istniejący lekarz
   - **Kroki**: Zmodyfikuj dane lekarza i zapisz zmiany
   - **Oczekiwany wynik**: Aktualizacja danych lekarza w bazie danych

3. **TS-DOC-003**: Usuwanie lekarza
   - **Warunki wstępne**: Zalogowany administrator, istniejący lekarz
   - **Kroki**: Usuń wybranego lekarza
   - **Oczekiwany wynik**: Usunięcie lekarza z bazy danych i aktualizacja listy

### 4.4 Wyszukiwanie lekarzy

1. **TS-SEARCH-001**: Wyszukiwanie na podstawie analizy AI
   - **Warunki wstępne**: Zalogowany użytkownik
   - **Kroki**: Wprowadź objawy, wykonaj wyszukiwanie
   - **Oczekiwany wynik**: Lista lekarzy dopasowanych do analizy symptomów

2. **TS-SEARCH-002**: Zapisywanie historii wyszukiwania
   - **Warunki wstępne**: Zalogowany użytkownik
   - **Kroki**: Wykonaj wyszukiwanie, przejdź do profilu
   - **Oczekiwany wynik**: Wyszukiwanie zapisane w historii użytkownika

## 5. Środowisko testowe

### 5.1 Środowisko deweloperskie

- **Konfiguracja**: Lokalne środowisko na maszynie dewelopera
- **Specyfikacja**: Node.js, npm, Vite, lokalna instancja Supabase lub mocki
- **Zastosowanie**: Testy jednostkowe, integracyjne podczas rozwoju

### 5.2 Środowisko CI/CD

- **Konfiguracja**: GitHub Actions
- **Specyfikacja**: Automatyczne uruchamianie testów przy każdym push i pull request
- **Zastosowanie**: Automatyczne testy jednostkowe, integracyjne, wybrane E2E

### 5.3 Środowisko testowe

- **Konfiguracja**: Dedykowane środowisko na Vercel/Netlify (staging)
- **Specyfikacja**: Testowa instancja Supabase, testowy klucz API OpenAI
- **Zastosowanie**: Pełne testy E2E, wydajnościowe, bezpieczeństwa

### 5.4 Środowisko produkcyjne

- **Konfiguracja**: Produkcyjne środowisko na Vercel/Netlify
- **Specyfikacja**: Produkcyjna instancja Supabase, produkcyjny klucz API OpenAI
- **Zastosowanie**: Smoke testy po wdrożeniu, monitoring wydajności

## 6. Narzędzia do testowania

### 6.1 Framework testów

- **Jest**: Główny framework testów jednostkowych i integracyjnych
- **React Testing Library**: Testowanie komponentów React
- **Cypress**: Testy end-to-end
- **Lighthouse**: Testy wydajności i dostępności

### 6.2 Narzędzia pomocnicze

- **ESLint/TypeScript**: Statyczna analiza kodu
- **Zod**: Walidacja schematu danych
- **GitHub Actions**: Automatyzacja procesu CI/CD
- **Devtools przeglądarek**: Debugowanie i analiza wydajności

## 7. Harmonogram testów

### 7.1 Testy podczas rozwoju

- **Częstotliwość**: Ciągłe, przy każdej zmianie kodu
- **Zakres**: Testy jednostkowe nowych i zmodyfikowanych funkcji
- **Wykonawcy**: Deweloperzy

### 7.2 Testy automatyczne w CI/CD

- **Częstotliwość**: Przy każdym push do repozytorium i pull request
- **Zakres**: Pełny zestaw testów jednostkowych i integracyjnych
- **Wykonawcy**: Automatycznie przez GitHub Actions

### 7.3 Testy przed wydaniem

- **Częstotliwość**: Przed każdym wydaniem
- **Zakres**: Testy E2E, wydajnościowe, dostępności
- **Wykonawcy**: QA, deweloperzy

### 7.4 Testy po wdrożeniu

- **Częstotliwość**: Po każdym wdrożeniu na produkcję
- **Zakres**: Smoke testy, monitoring wydajności
- **Wykonawcy**: QA, automatyczne narzędzia

## 8. Kryteria akceptacji testów

### 8.1 Kryteria ilościowe

- **Pokrycie kodu testami**: Minimum 90% dla kluczowych funkcjonalności
- **Wydajność**:
  - Średni czas ładowania strony: poniżej 2 sekund
  - Średni czas analizy zapytania AI: poniżej 3 sekund
  - Wynik Lighthouse dla wydajności mobilnej: minimum 85/100
- **Dostępność**: Zgodność z WCAG 2.1 AA, wynik Lighthouse minimum 90/100

### 8.2 Kryteria jakościowe

- **Bezpieczeństwo**: Brak krytycznych i wysokich luk bezpieczeństwa
- **Funkcjonalność**: Wszystkie scenariusze testowe krytyczne przechodzą pomyślnie
- **Użyteczność**: Spójna, intuicyjna nawigacja i interfejs użytkownika

### 8.3 Klasyfikacja błędów

- **Krytyczne**: Blokują podstawowe funkcjonalności, wymagane natychmiastowe naprawy
- **Wysokie**: Poważnie wpływają na kluczowe funkcjonalności
- **Średnie**: Utrudniają korzystanie, ale mają obejścia
- **Niskie**: Kosmetyczne problemy, nie wpływają na funkcjonalność

## 9. Role i odpowiedzialności w procesie testowania

### 9.1 Deweloperzy

- Implementacja testów jednostkowych i integracyjnych
- Naprawa błędów odkrytych przez testy
- Przegląd kodu testów

### 9.2 Testerzy/QA

- Implementacja i wykonywanie testów E2E
- Testy eksploracyjne
- Weryfikacja napraw błędów

### 9.3 DevOps

- Konfiguracja i utrzymanie środowisk testowych
- Konfiguracja i monitorowanie CI/CD
- Analiza i optymalizacja wydajności

### 9.4 Product Owner

- Definiowanie kryteriów akceptacji
- Priorytetyzacja błędów
- Ostateczna akceptacja jakości przed wydaniem

## 10. Procedury raportowania błędów

### 10.1 Format raportu błędu

- **Tytuł**: Krótki, opisowy tytuł
- **Priorytet**: Krytyczny/Wysoki/Średni/Niski
- **Środowisko**: Gdzie wystąpił błąd
- **Kroki reprodukcji**: Szczegółowe kroki do odtworzenia
- **Aktualny wynik**: Co się dzieje
- **Oczekiwany wynik**: Co powinno się dziać
- **Załączniki**: Zrzuty ekranu, logi, nagrania

### 10.2 Cykl życia błędu

1. **Nowy**: Błąd został zgłoszony
2. **Przypisany**: Błąd został przydzielony do naprawy
3. **W trakcie naprawy**: Deweloper pracuje nad rozwiązaniem
4. **Do weryfikacji**: Naprawa czeka na weryfikację
5. **Zamknięty**: Błąd został naprawiony i zweryfikowany
6. **Odrzucony**: Błąd nie jest prawidłowy lub został zduplikowany

## 11. Metryki i raportowanie

### 11.1 Metryki testów

- Liczba/procent testów zakończonych pomyślnie
- Pokrycie kodu testami
- Liczba odkrytych błędów według priorytetu
- Czas naprawy błędów
- Wyniki testów wydajnościowych i dostępności

### 11.2 Raportowanie

- Automatyczne raporty z testów CI/CD
- Tygodniowe podsumowanie statusu testów
- Raporty przed wydaniem
- Dashboard monitoringu błędów

## 12. Zarządzanie ryzykiem

### 12.1 Potencjalne ryzyka

- Integracja z OpenAI API (nieprzewidywalne odpowiedzi, koszty, limity)
- Problemy z autoryzacją i bezpieczeństwem
- Wydajność przy dużej liczbie zapytań
- Obsługa błędów w integracji z Supabase

### 12.2 Strategie minimalizacji ryzyka

- Dokładne mockowanie API OpenAI w testach
- Szczegółowe testy zabezpieczeń i polityk RLS
- Monitoring wydajności i implementacja cachowania
- Automatyzacja testów dla najważniejszych funkcjonalności
