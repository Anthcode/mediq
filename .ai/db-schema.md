# Opis Bazy Danych Aplikacji Medycznej

## Tabele i ich struktura

### search_history
| Kolumna | Typ | Opis |
|---------|-----|------|
| id | uuid | Unikalny identyfikator wyszukiwania |
| user_id | uuid | Identyfikator użytkownika (klucz obcy do profiles) |
| query | text | Zapytanie wyszukiwania |
| specialties | json | Specjalizacje lekarskie zawarte w zapytaniu |
| created_at | timestamp | Data i czas utworzenia wpisu |

### profiles
| Kolumna | Typ | Opis |
|---------|-----|------|
| id | uuid | Unikalny identyfikator profilu |
| email | text | Adres email użytkownika |
| first_name | text | Imię użytkownika |
| last_name | text | Nazwisko użytkownika |
| created_at | timestamp | Data i czas utworzenia profilu |
| role | varchar | Rola użytkownika w systemie |
| updated_at | timestamp | Data i czas ostatniej aktualizacji |

*Powiązanie z auth.users.id dla uwierzytelniania*

### ratings
| Kolumna | Typ | Opis |
|---------|-----|------|
| id | uuid | Unikalny identyfikator oceny |
| doctor_id | uuid | Identyfikator lekarza (klucz obcy do doctors) |
| user_id | uuid | Identyfikator użytkownika (klucz obcy do profiles) |
| rating | int | Ocena liczbowa |
| comment | text | Komentarz do oceny |
| created_at | timestamp | Data i czas utworzenia oceny |
| updated_at | timestamp | Data i czas ostatniej aktualizacji |

### addresses
| Kolumna | Typ | Opis |
|---------|-----|------|
| id | uuid | Unikalny identyfikator adresu |
| doctor_id | uuid | Identyfikator lekarza (klucz obcy do doctors) |
| street | text | Nazwa ulicy |
| city | text | Nazwa miasta |
| state | text | Nazwa stanu/województwa |
| postal_code | text | Kod pocztowy |
| country | text | Nazwa kraju |
| created_at | timestamp | Data i czas utworzenia adresu |
| updated_at | timestamp | Data i czas ostatniej aktualizacji |

### doctors
| Kolumna | Typ | Opis |
|---------|-----|------|
| id | uuid | Unikalny identyfikator lekarza |
| first_name | text | Imię lekarza |
| last_name | text | Nazwisko lekarza |
| experience | int | Doświadczenie (prawdopodobnie w latach) |
| education | text | Wykształcenie |
| bio | text | Biografia/opis lekarza |
| profile_image_url | text | URL do zdjęcia profilowego |
| active | bool | Status aktywności lekarza |
| created_at | timestamp | Data i czas utworzenia profilu |
| updated_at | timestamp | Data i czas ostatniej aktualizacji |
| specialties | text | Specjalizacje lekarskie |

## Relacje

- Profil użytkownika (`profiles`) jest powiązany z jego historią wyszukiwań (`search_history`)
- Lekarz (`doctors`) może mieć wiele adresów (`addresses`)
- Lekarz (`doctors`) może otrzymać wiele ocen (`ratings`) od różnych użytkowników
- Użytkownik (`profiles`) może wystawić wiele ocen (`ratings`) różnym lekarzom

## Funkcjonalność

System umożliwia:
1. Rejestrację i zarządzanie profilami użytkowników
2. Wyszukiwanie lekarzy (z uwzględnieniem specjalizacji)
3. Przeglądanie profili lekarzy zawierających ich doświadczenie, wykształcenie i biografię
4. Sprawdzanie adresów praktyk lekarskich
5. Wystawianie ocen i komentarzy lekarzom
6. Śledzenie historii wyszukiwań użytkowników

Ta struktura bazy danych jest odpowiednia dla aplikacji służącej do wyszukiwania i oceniania lekarzy lub platformy medycznej łączącej pacjentów z lekarzami.