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

## Operacje wymagające backend API

Następujące operacje wymagają backend API (Edge Functions lub backend endpoint):
- Dodawanie nowych użytkowników (`addUser`)
- Usuwanie użytkowników (`deleteUser`)
- Potwierdzanie email w `auth.users` (opcjonalne, jeśli nie wyłączysz wymagania)

Możesz zaimplementować te funkcje używając:
- Supabase Edge Functions (Deno)
- Backend API (Node.js, Python, itp.)
- Supabase Database Webhooks z zewnętrznym API

## Aktualne działanie aplikacji

Po wyłączeniu wymagania potwierdzenia email:
- ✅ Rejestracja działa (tworzy użytkownika z `active = 0`)
- ✅ Logowanie działa (sprawdza tylko `active`)
- ✅ Edycja użytkownika działa (aktualizuje `active`, `role`, `full_name`)
- ✅ Usuwanie i dodawanie użytkowników wymaga backend API






