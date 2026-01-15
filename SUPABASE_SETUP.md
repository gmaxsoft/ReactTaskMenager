# Konfiguracja Supabase

## Ważne: Service Role Key w przeglądarce

⚠️ **Service role key NIE MOŻE być używany w kodzie klienta (przeglądarce)!**

Service role key ma pełne uprawnienia do bazy danych i powinien być używany TYLKO:
- W Supabase Edge Functions
- W backend API (Node.js, Python, itp.)
- W bezpiecznym środowisku serwerowym

Użycie service role key w przeglądarce jest niebezpieczne i Supabase blokuje takie żądania!

## Wyłączenie wymagania potwierdzenia email

Aby aplikacja działała poprawnie bez użycia admin API, musisz wyłączyć wymaganie potwierdzenia email w ustawieniach Supabase:

1. Zaloguj się do [Supabase Dashboard](https://app.supabase.com)
2. Wybierz swój projekt
3. Przejdź do **Settings** → **Authentication**
4. W sekcji **Email Auth** znajdź opcję **"Confirm email"**
5. **Wyłącz** tę opcję (odznacz checkbox)
6. Zapisz zmiany

Po wyłączeniu tej opcji:
- Użytkownicy będą mogli się logować bez potwierdzania email
- Kontrola dostępu będzie odbywać się tylko przez kolumnę `active` w tabeli `users`
- Admin będzie mógł aktywować/dezaktywować użytkowników przez ustawienie `active = 1` lub `active = 0`

## Migracje bazy danych

Uruchom następujące migracje w Supabase:

1. **Tabela użytkowników:**
   ```sql
   -- Uruchom zawartość pliku supabase/migrations/001_create_users_table.sql
   ```

2. **Tabela zadań:**
   ```sql
   -- Uruchom zawartość pliku supabase/migrations/002_create_tasks_table.sql
   ```

## Edge Functions

Aplikacja używa następujących Supabase Edge Functions:

### Funkcje użytkowników:
- `add-user` - Dodawanie nowych użytkowników (tylko administratorzy)
- `delete-user` - Usuwanie użytkowników (tylko administratorzy)

### Funkcje zadań:
- `add-task` - Dodawanie nowych zadań
- `delete-task` - Usuwanie zadań (użytkownicy mogą usuwać swoje zadania, administratorzy wszystkie)

Aby zainstalować funkcje:
```bash
# Zainstaluj Supabase CLI jeśli nie masz
npm install -g supabase

# Zaloguj się do Supabase
supabase login

# Zainicjuj projekt (jeśli nie zrobione)
supabase init

# Połącz z istniejącym projektem
supabase link --project-ref YOUR_PROJECT_REF

# Wdróż funkcje
supabase functions deploy add-user
supabase functions deploy delete-user
supabase functions deploy add-task
supabase functions deploy delete-task
```

## Operacje wymagające backend API

Następujące operacje wymagają backend API (Edge Functions lub backend endpoint):
- Dodawanie nowych użytkowników (`addUser`) - tylko administratorzy
- Usuwanie użytkowników (`deleteUser`) - tylko administratorzy
- Dodawanie zadań (`addTask`) - wszyscy użytkownicy
- Usuwanie zadań (`deleteTask`) - użytkownicy mogą usuwać swoje zadania, administratorzy wszystkie
- Potwierdzanie email w `auth.users` (opcjonalne, jeśli nie wyłączysz wymagania)

Możesz zaimplementować te funkcje używając:
- Supabase Edge Functions (Deno)
- Backend API (Node.js, Python, itp.)
- Supabase Database Webhooks z zewnętrznym API

## Aktualne działanie aplikacji

Po skonfigurowaniu Edge Functions i wyłączeniu wymagania potwierdzenia email:

### Funkcjonalność użytkowników:
- ✅ Rejestracja działa (tworzy użytkownika z `active = 0`)
- ✅ Logowanie działa (sprawdza tylko `active`)
- ✅ Edycja użytkownika działa (aktualizuje `active`, `role`, `full_name`)
- ✅ Dodawanie użytkowników wymaga Edge Function `add-user` (tylko administratorzy)
- ✅ Usuwanie użytkowników wymaga Edge Function `delete-user` (tylko administratorzy)

### Funkcjonalność zadań:
- ✅ Wyświetlanie zadań działa (RLS kontroluje dostęp)
- ✅ Dodawanie zadań wymaga Edge Function `add-task`
- ✅ Edycja zadań działa bezpośrednio przez Supabase (RLS kontroluje dostęp)
- ✅ Usuwanie zadań wymaga Edge Function `delete-task`
- ✅ Użytkownicy widzą tylko swoje zadania, administratorzy wszystkie

### Kontrola dostępu:
- **Użytkownicy standardowi:** Mogą zarządzać swoimi zadaniami i profilem
- **Administratorzy:** Mogą zarządzać wszystkimi użytkownikami i zadaniami
- **RLS (Row Level Security):** Aktywne na wszystkich tabelach dla bezpieczeństwa









