# MedIQ Development Guidelines

## Opis Aplikacji

Aplikacja MedIQ łączy pacjentów z odpowiednimi lekarzami na podstawie analizy symptomów za pomocą sztucznej inteligencji. Została stworzona przy użyciu:

- **React z TypeScript i Vite** jako bundler
- **Styled Components** do stylowania
- **React Router** do nawigacji
- **Supabase** do autentykacji i obsługi bazy danych
- **OpenAI API** do analizy zapytań zdrowotnych

## Główne Obszary Rozwoju

1. **Implementacja pełnego CRUD dla lekarzy**  
   (aktualnie dostępny jest tylko odczyt)

2. **Tworzenie testów jednostkowych/e2e**  
   dla kluczowych funkcjonalności aplikacji.

3. **Konfiguracja CI/CD**  
   z użyciem GitHub Actions.

4. **Utrzymanie czystego kodu**  
   zgodnego z TypeScript i najlepszymi praktykami React.

5. **Optymalizacja integracji z AI**  
   w celu poprawy dokładności rekomendacji.

## Frontend

### Wskazówki dla React

- Używaj **komponentów funkcyjnych** z hookami zamiast komponentów klasowych.
- Implementuj **React.memo()** dla kosztownych komponentów renderujących się często z tymi samymi propsami.
- Wykorzystuj **React.lazy()** i **Suspense** do dzielenia kodu i optymalizacji wydajności.
- Używaj hooka **useCallback** dla przekazywania handlerów zdarzeń do komponentów potomnych w celu zapobiegania niepotrzebnym renderom.
- Preferuj **useMemo** do kosztownych obliczeń, aby uniknąć ponownego przeliczania przy każdym renderze.
- Korzystaj z **useId()** dla generowania unikalnych identyfikatorów dla atrybutów związanych z dostępnością.
- W projektach korzystających z React 19+ rozważ użycie nowego hooka **use** do pobierania danych.
- W zastosowaniach z Next.js lub podobnymi frameworkami, rozważ użycie **Server Components** dla komponentów wymagających intensywnego pobierania danych.
- Pomyśl o zastosowaniu **useOptimistic** dla optymistycznych aktualizacji UI w formularzach.
- Używaj **useTransition** dla niepilnych aktualizacji stanu, aby UI pozostało responsywne.

### Wskazówki dla Stylowania (Styled Components)

- Wdrażaj **ThemeProvider** w celu zapewnienia spójnego motywu w całej aplikacji.
- Wykorzystuj **css helper** do dzielenia się stylami pomiędzy komponentami.
- Używaj propsów dla warunkowego stylowania w szablonach string.
- Stosuj **createGlobalStyle** do definiowania globalnych stylów.
- Implementuj metodę **attrs** w celu przekazywania atrybutów HTML do elementów DOM.
- Używaj propsa **as** do dynamicznego renderowania komponentów.
- Rozszerzaj istniejące komponenty za pomocą składni **styled(Component)**.
- Zastosuj **css prop** dla jednorazowych potrzeb stylizacyjnych.
- Używaj znaku **&** do zagnieżdżania selektorów.
- Wykorzystuj **keyframes helper** do definiowania animacji.

## Backend i Integracja z AI

- Używaj **Supabase** jako głównego serwisu backendowego dla autentykacji oraz interakcji z bazą danych.
- Przestrzegaj wytycznych Supabase dotyczących bezpieczeństwa i wydajności.
- Korzystaj z instancji klienta Supabase zdefiniowanej w `src/lib/supabase.ts`, pamiętając o używaniu typu `SupabaseClient` z tego pliku zamiast importowania go bezpośrednio z `@supabase/supabase-js`.
- Wykorzystuj **Zod** do walidacji danych przekazywanych między frontendem a backendem.
