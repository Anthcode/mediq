# Stos technologiczny dla projektu MedIQ

## Frontend - React z TypeScript dla nowoczesnego interfejsu

- React 18+ z funkcyjnymi komponentami i hookami zamiast komponentów klasowych
- TypeScript zapewnia statyczne typowanie i zwiększa bezpieczeństwo kodu
- Styled Components z ThemeProvider dla spójnego motywu oraz Tailwind CSS dla szybkiego prototypowania
- React Router v6 do zarządzania nawigacją w aplikacji
- Vite jako szybki bundler i serwer deweloperski
- Lucide-react jako biblioteka ikon dla spójnego interfejsu użytkownika

## Backend - Supabase jako kompleksowe rozwiązanie backendowe

- Gotowy system autentykacji i autoryzacji użytkowników
- Baza danych PostgreSQL z automatycznie generowanym REST API
- Przechowywanie plików (zdjęcia lekarzy, dokumenty) w Supabase Storage
- Row Level Security (RLS) do zarządzania dostępem do danych
- Edge Functions do implementacji niestandardowej logiki biznesowej

## AI - Integracja z OpenAI API

- Model GPT-4o-mini do analizy zapytań zdrowotnych użytkowników
- Identyfikacja symptomów z opisów w języku naturalnym
- Sugestie odpowiednich specjalizacji medycznych
- Obliczanie dopasowania lekarzy do symptomów pacjenta
- Cachowanie podobnych zapytań dla optymalizacji kosztów

## Testowanie i CI/CD

- Jest i React Testing Library do testów jednostkowych i komponentów
- Cypress do testów end-to-end dla kluczowych ścieżek użytkownika
- ESLint i Prettier do zapewnienia jakości i spójności kodu
- GitHub Actions do automatyzacji procesu testowania, budowania i wdrażania
- Husky do uruchamiania testów i lintingu przed commitami

## Hosting

- Wdrożenie na platformie Vercel lub Netlify
- Konfiguracja zmiennych środowiskowych dla różnych środowisk (dev, test, prod)
- Automatyczne budowanie i wdrażanie z GitHub Actions
- CDN dla szybkiego dostarczania treści
- HTTPS i odpowiednie zabezpieczenia dla danych użytkowników
