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

- Analiza objawów oparta na AI z wykorzystaniem modelu OpenAI GPT-4o-mini 🤖
- Kompleksowe funkcje CRUD do zarządzania profilami lekarzy 🏥
- Uwierzytelnianie użytkowników i zarządzanie profilami z wykorzystaniem Supabase 🔐
- Responsywny design zorientowany na urządzenia mobilne zapewniający dostępność na wszystkich urządzeniach 📱
- Zautomatyzowane testy i pipeline CI/CD zapewniające jakość kodu i efektywność wdrażania ✅

## Stos technologiczny

- **Frontend:** React 18+, TypeScript, Vite, React Router v6, Styled Components, Tailwind CSS, Lucide-react (ikony) oraz React hooks (useState, useEffect, itp.).
- **Backend:** Supabase do uwierzytelniania, PostgreSQL jako baza danych, Supabase Storage do przechowywania mediów oraz integracja z OpenAI API do analizy zapytań zdrowotnych.
- **DevOps i Testy:** GitHub Actions do CI/CD, Jest i React Testing Library do testów jednostkowych, Cypress do testów end-to-end, ESLint i Prettier do zapewnienia jakości kodu.

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

3. **Uruchomienie serwera deweloperskiego:**

   ```sh
   npm run dev
   ```

4. **Otwarcie przeglądarki:**
   Odwiedź [http://localhost:3000](http://localhost:3000) lub port określony przez Vite.

## Dostępne skrypty

- **`npm run dev`**: Uruchamia serwer deweloperski z hot module replacement.
- **`npm run build`**: Buduje aplikację w wersji produkcyjnej.
- **`npm run preview`**: Serwuje zbudowaną wersję produkcyjną lokalnie.
- **`npm test`**: Uruchamia testy jednostkowe i integracyjne przy użyciu Jest i React Testing Library.
- **`npm run e2e`**: Uruchamia testy end-to-end z Cypress.
- **`npm run lint`**: Sprawdza problemy z jakością kodu przy użyciu ESLint.

## Zakres projektu

### Funkcje w zakresie

- Wyszukiwanie lekarzy oparte na AI na podstawie objawów wprowadzonych przez użytkownika.
- Pełne operacje CRUD do zarządzania profilami lekarzy (tworzenie, edycja, przeglądanie i usuwanie).
- Uwierzytelnianie użytkowników i zarządzanie sesjami z wykorzystaniem Supabase.
- Responsywny interfejs użytkownika zorientowany na urządzenia mobilne, zaprojektowany zgodnie z wytycznymi WCAG 2.1 AA.
- Zautomatyzowane testy (jednostkowe, integracyjne i e2e) oraz pipeline CI/CD poprzez GitHub Actions.
- Mechanizmy cache'owania do optymalizacji zapytań API.
- Optymalizacja wydajności z wykorzystaniem technik takich jak lazy loading i React.memo.

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
