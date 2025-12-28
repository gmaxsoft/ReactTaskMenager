# Supabase Database Migrations

## Instalacja i konfiguracja

### 1. Wykonanie migracji w Supabase Dashboard

1. Zaloguj się do [Supabase Dashboard](https://app.supabase.com)
2. Wybierz swój projekt
3. Przejdź do **SQL Editor**
4. Skopiuj zawartość plików migracji w kolejności:
   - `migrations/001_create_users_table.sql`
   - `migrations/002_create_tasks_table.sql`
5. Wklej do edytora SQL i kliknij **Run**

### 2. Alternatywnie - użycie Supabase CLI

Jeśli masz zainstalowany Supabase CLI:

```bash
# Zainstaluj Supabase CLI (jeśli nie masz)
npm install -g supabase

# Zaloguj się
supabase login

# Połącz się z projektem
supabase link --project-ref vprdamfagdhsyokzkfhy

# Zastosuj migracje
supabase db push
```

## Struktura tabeli Users

Tabela `public.users` zawiera:

- **id** (UUID) - Referencja do `auth.users.id`, klucz główny
- **email** (TEXT) - Email użytkownika (unique)
- **full_name** (TEXT) - Pełne imię i nazwisko
- **avatar_url** (TEXT) - URL do awatara użytkownika
- **role** (TEXT) - Rola użytkownika: 'user' lub 'admin' (domyślnie 'user')
- **created_at** (TIMESTAMP) - Data utworzenia
- **updated_at** (TIMESTAMP) - Data ostatniej aktualizacji

## Row Level Security (RLS)

Tabela ma włączone RLS z następującymi politykami:

1. **Users can view own profile** - Użytkownicy mogą przeglądać swój własny profil
2. **Users can update own profile** - Użytkownicy mogą aktualizować swój własny profil
3. **Users can insert own profile** - Użytkownicy mogą tworzyć swój własny profil
4. **Admins can view all profiles** - Administratorzy mogą przeglądać wszystkie profile

## Automatyczne funkcje

- **handle_new_user()** - Automatycznie tworzy profil użytkownika w tabeli `public.users` gdy użytkownik rejestruje się przez `auth.users`
- **handle_updated_at()** - Automatycznie aktualizuje pole `updated_at` przy każdej zmianie

## Struktura tabeli Tasks

Tabela `public.tasks` zawiera:

- **id** (UUID) - Unikalny identyfikator zadania (klucz główny)
- **title** (TEXT) - Nazwa/tytuł zadania (wymagane)
- **description** (TEXT) - Opis zadania (długi tekst, opcjonalne)
- **priority** (TEXT) - Priorytet zadania: 'low', 'medium', 'high', 'urgent' (domyślnie 'medium')
- **status** (TEXT) - Status zadania: 'W trakcie', 'Testowanie', 'Aktualizacja', 'Zakończenie' (domyślnie 'W trakcie')
- **user_id** (UUID) - Referencja do `auth.users.id`, użytkownik przypisany do zadania (wymagane)
- **start_date** (TIMESTAMP) - Data rozpoczęcia prac (opcjonalne)
- **end_date** (TIMESTAMP) - Data zakończenia prac (opcjonalne)
- **created_at** (TIMESTAMP) - Data utworzenia zadania
- **updated_at** (TIMESTAMP) - Data ostatniej aktualizacji zadania

## Row Level Security (RLS) dla Tasks

Tabela Tasks ma włączone RLS z następującymi politykami:

1. **Users can view own tasks** - Użytkownicy widzą tylko swoje zadania
2. **Users can insert own tasks** - Użytkownicy mogą tworzyć tylko swoje zadania
3. **Users can update own tasks** - Użytkownicy mogą aktualizować tylko swoje zadania
4. **Users can delete own tasks** - Użytkownicy mogą usuwać tylko swoje zadania
5. **Admins can view all tasks** - Administratorzy mogą przeglądać wszystkie zadania
6. **Admins can update all tasks** - Administratorzy mogą aktualizować wszystkie zadania
7. **Admins can delete all tasks** - Administratorzy mogą usuwać wszystkie zadania

## Automatyczne funkcje dla Tasks

- **handle_tasks_updated_at()** - Automatycznie aktualizuje pole `updated_at` przy każdej zmianie zadania

## Uwagi

- Profil użytkownika jest automatycznie tworzony przy rejestracji dzięki triggerowi `on_auth_user_created`
- Email jest synchronizowany z `auth.users`
- RLS zapewnia, że użytkownicy widzą tylko swoje dane (chyba że są adminami)
- Zadania są automatycznie przypisane do użytkownika, który je tworzy
- Indeksy zostały dodane dla lepszej wydajności zapytań (user_id, status, priority, daty)







