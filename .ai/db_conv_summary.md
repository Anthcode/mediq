<conversation_summary>
<decisions>
1. System będzie miał dwie główne role użytkowników: pacjenci (zwykli użytkownicy) i administratorzy, gdzie pacjenci mogą wyszukiwać lekarzy tylko po zalogowaniu.
2. Historia wyszukiwań pacjenta będzie zawierać pełne zapytanie oraz zwrócone sugerowane specjalizacje.
3. Administratorzy będą mieć dostęp do całości danych i będą odpowiedzialni za wprowadzanie danych lekarzy.
4. Specjalizacje lekarskie będą implementowane jako prosta lista, bez hierarchicznej struktury.
5. System będzie przechowywać przetworzone dane z analizy AI, nie surowe wyniki.
6. System będzie obsługiwać wiele adresów dla jednego lekarza.
7. Obszary ekspertyzy lekarzy będą definiowane wyłącznie przez administratorów.
8. Wszystkie tabele będą zawierać automatyczne timestampy (created_at, updated_at) do śledzenia historii zmian.
9. System będzie obsługiwać tylko język polski.
10. Funkcje geolokalizacji nie będą implementowane w MVP.
11. System będzie używać trwałego usuwania danych, bez mechanizmu soft-delete.
12. Rating lekarzy będzie agregacją zewnętrznych ocen tylko od zalogowanych użytkowników.
13. Zdjęcia lekarzy będą przechowywane jako URL do zdjęcia.
14. Z wyników analizy AI będzie przechowywane tylko pole specjalizacje.
15. Dopasowanie lekarzy do zapytań użytkowników będzie realizowane na podstawie dopasowania do specjalizacji.
</decisions>

<matched_recommendations>
1. Wykorzystanie Supabase Auth z natywną tabelą `auth.users` jako podstawą systemu autoryzacji, rozszerzoną o własne tabele profilowe.
2. Zastosowanie relacji polimorficznej dla użytkowników, aby rozróżnić pacjentów i administratorów.
3. Implementacja UUID jako typu klucza głównego dla wszystkich tabel zamiast sekwencyjnych identyfikatorów.
4. Wykorzystanie typu danych JSONB dla przechowywania przetworzonych wyników analizy AI (pole specjalizacje).
5. Zastosowanie PostgreSQL Full Text Search (FTS) do efektywnego wyszukiwania lekarzy.
6. Implementacja systemu indeksów dla najczęściej przeszukiwanych kolumn.
7. Dodanie automatycznych timestampów (created_at, updated_at) do wszystkich tabel.
8. Implementacja Row Level Security (RLS) w Supabase, definiując polityki dostępu dla różnych ról użytkowników.
9. Użycie tabel junction (łącznikowych) dla relacji many-to-many (np. lekarze-specjalizacje, lekarze-adresy).
10. Zastosowanie type/enum dla specjalizacji lekarskich.
11. Utworzenie tabeli ratings dla przechowywania ocen lekarzy od zalogowanych użytkowników.
</matched_recommendations>

<database_planning_summary>
Projekt bazy danych dla MVP MedIQ będzie oparty na PostgreSQL i zintegrowany z Supabase. System autoryzacji będzie wykorzystywał natywną tabelę `auth.users` Supabase, rozszerzoną o własne tabele profilowe dla rozróżnienia ról użytkowników (pacjent, administrator).

### Kluczowe encje i relacje:

1. **Użytkownicy (users)** - rozszerzenie tabeli `auth.users` z Supabase
   - Relacja polimorficzna dla rozróżnienia pacjentów i administratorów
   - UUID jako klucz główny

2. **Lekarze (doctors)**
   - Podstawowe informacje o lekarzu (imię, nazwisko, doświadczenie, edukacja, bio)
   - URL do zdjęcia profilowego
   - Relacja one-to-many z adresami (jeden lekarz może mieć wiele adresów)
   - Relacja many-to-many ze specjalizacjami poprzez tabelę junction
   - Relacja many-to-many z obszarami ekspertyzy poprzez tabelę junction

3. **Oceny (ratings)**
   - Oceny lekarzy dodawane tylko przez zalogowanych użytkowników
   - Relacja many-to-one z lekarzami
   - Relacja many-to-one z użytkownikami
   - Zagregowana ocena będzie obliczana na podstawie tej tabeli

4. **Specjalizacje (specialties)**
   - Prosta lista specjalizacji lekarskich
   - Implementacja jako type/enum

5. **Obszary ekspertyzy (expertise_areas)**
   - Lista obszarów ekspertyzy definiowanych przez administratorów

6. **Adresy (addresses)**
   - Informacje o lokalizacji gabinetu/przychodni
   - Relacja many-to-one z lekarzami

7. **Historia wyszukiwań (search_history)**
   - Pełne zapytanie użytkownika
   - Przechowywanie tylko pola specjalizacje z wyników analizy AI
   - Relacja many-to-one z użytkownikami

Wszystkie tabele będą używać UUID jako klucza głównego i będą zawierać automatyczne timestampy (created_at, updated_at) do śledzenia historii zmian. Dla przechowywania wyników analizy AI (pole specjalizacje) zostanie wykorzystany typ danych JSONB, co zapewni elastyczność w przechowywaniu strukturyzowanych danych.

System będzie wykorzystywał Row Level Security (RLS) w Supabase, aby zapewnić, że użytkownicy mają dostęp tylko do tych danych, do których są uprawnieni. Administratorzy będą mieć pełny dostęp do wszystkich danych, podczas gdy pacjenci będą mieć dostęp tylko do publicznych informacji o lekarzach i własnej historii wyszukiwań.

PostgreSQL Full Text Search (FTS) zostanie wykorzystany do efektywnego wyszukiwania lekarzy na podstawie opisów, specjalizacji i obszarów ekspertyzy. System indeksów zostanie zaimplementowany dla najczęściej przeszukiwanych kolumn, aby zapewnić wydajność wyszukiwania.

Dopasowanie lekarzy do zapytań użytkowników będzie realizowane na podstawie dopasowania do specjalizacji, które zostaną zidentyfikowane przez analizę AI zapytania użytkownika. System będzie porównywać sugerowane specjalizacje z specjalizacjami lekarzy w bazie danych.
</database_planning_summary>

<unresolved_issues>
Wszystkie kluczowe kwestie zostały wyjaśnione.
</unresolved_issues>
</conversation_summary>