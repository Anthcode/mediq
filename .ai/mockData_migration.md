# Plan migracji z mockData do pobierania danych z Supabase

Poniżej przedstawiam kroki niezbędne do zastąpienia logiki wykorzystywanej do pobierania danych z modułu mockData implementacją korzystającą z Supabase:

1. **Zidentyfikowanie miejsc wykorzystania mockData**
   - Przejrzyj wszystkie komponenty (np. listę lekarzy, widoki szczegółowe), w których importowany jest moduł `mockData.ts`.
   - Zanotuj miejsca, w których mockData jest używane do inicjalizacji stanu lub prezentacji danych.

2. **Konfiguracja klienta Supabase**
   - Upewnij się, że plik `src/lib/supabase.ts` zawiera poprawnie skonfigurowaną instancję klienta (typ `SupabaseClient`).
   - Sprawdź, czy korzystasz z dedykowanej konfiguracji zgodnej z dokumentacją Supabase oraz wytycznymi dotyczącymi bezpieczeństwa i wydajności.

3. **Utworzenie serwisu do pobierania danych**
   - Stwórz lub zaktualizuj moduł serwisowy, np. `src/services/doctorsService.ts`.
   - W module utwórz funkcję `getDoctors()`, która będzie:
     - Łączyć się z tabelą `doctors` oraz powiązanymi tabelami: `addresses`, `specialties`, `expertise_areas`, `doctors_specialties`, `doctors_expertise_areas` (w razie potrzeby wykonując dodatkowe zapytania lub łączenie danych).
     - Używać klienta Supabase zdefiniowanego w `src/lib/supabase.ts`.
     - Typować zwracane dane przy użyciu interfejsów z `src/types/database.types.ts`.

4. **Migracja logiki w komponentach**
   - Usuń importy i odwołania do `mockData.ts` w odpowiedzialnych za wyświetlanie danych komponentach.
   - Zastąp pobieranie danych wywołaniem funkcji `getDoctors()` z nowego serwisu.
   - Dostosuj obsługę stanów ładowania, błędów oraz przetwarzania danych (np. poprzez użycie hooków typu `useEffect`, `React.lazy()` dla optymalizacji).

5. **Optymalizacja i dobre praktyki**
   - Upewnij się, że dane pobierane z Supabase są odpowiednio typowane zgodnie z interfejsami z `database.types.ts`.
   - Rozważ wdrożenie dodatkowych technik optymalizacji, takich jak:
     - Używanie `React.memo()` dla komponentów, które renderują się często.
     - Wykorzystanie `useCallback` i `useMemo` w celu optymalizacji przekazywania funkcji oraz kosztownych obliczeń.
     - W miarę możliwości użycie `Suspense` oraz `React.lazy()` do asynchronicznego ładowania komponentów.

