# Task Manager

![Task Manager Preview](taskMenager.webp)

Nowoczesna aplikacja do zarządzania zadaniami zbudowana w React z TypeScript, wykorzystująca Supabase jako backend.

## 🚀 Funkcje

### Zarządzanie użytkownikami
- Rejestracja i logowanie użytkowników
- System ról (użytkownik/administrator)
- Zarządzanie profilami użytkowników
- Kontrola dostępu oparta na rolach

### Zarządzanie zadaniami
- Tworzenie, edycja i usuwanie zadań
- System priorytetów (Niski, Średni, Wysoki, Pilny)
- Statusy zadań (Nie rozpoczęto, W trakcie, Testowanie, Aktualizacja, Zakończenie)
- Daty rozpoczęcia i zakończenia
- Kontrola dostępu - użytkownicy widzą tylko swoje zadania

### Interfejs użytkownika
- Responsywny design z Tailwind CSS
- Tabele z sortowaniem i paginacją
- Formularze modalne dla edycji
- Ciemny motyw nawigacji
- Intuicyjna nawigacja między sekcjami

## 🛠 Technologie

- **Frontend:** React 19, TypeScript, Vite
- **Stylizacja:** Tailwind CSS
- **Stan aplikacji:** Zustand
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **Tabele:** TanStack Table v8
- **Narzędzia:** ESLint, PostCSS, Autoprefixer
- **Testowanie:** Vitest, @testing-library/react, jsdom

## 📦 Instalacja

### Wymagania wstępne
- Node.js (wersja 18+)
- npm lub yarn
- Konto Supabase

### 1. Klonowanie repozytorium
```bash
git clone <repository-url>
cd taskmanager
```

### 2. Instalacja zależności
```bash
npm install
```

### 3. Konfiguracja Supabase

#### a) Utwórz nowy projekt w Supabase
1. Przejdź do [Supabase Dashboard](https://app.supabase.com)
2. Utwórz nowy projekt
3. Zanotuj `SUPABASE_URL` i `SUPABASE_ANON_KEY`

#### b) Uruchom migracje
Uruchom SQL z plików migracyjnych w Supabase SQL Editor:
- `supabase/migrations/001_create_users_table.sql`
- `supabase/migrations/002_create_tasks_table.sql`

#### c) Skonfiguruj autoryzację
W ustawieniach Supabase:
1. **Settings** → **Authentication** → **Email Auth**
2. **Wyłącz** opcję "Confirm email"

#### d) Wdróż Edge Functions
```bash
# Zainstaluj Supabase CLI
npm install -g supabase

# Zaloguj się
supabase login

# Połącz z projektem
supabase link --project-ref YOUR_PROJECT_REF

# Wdróż funkcje
supabase functions deploy add-user
supabase functions deploy delete-user
supabase functions deploy add-task
supabase functions deploy delete-task
```

### 4. Konfiguracja środowiska
Utwórz plik `.env.local` w katalogu głównym projektu:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Uruchomienie aplikacji
```bash
npm run dev
```

Aplikacja będzie dostępna na `http://localhost:5173`

## 📁 Struktura projektu

```
taskmanager/
├── src/
│   ├── components/
│   │   ├── layout/          # Komponenty layoutu
│   │   ├── tasks/           # Komponenty zadań
│   │   ├── users/           # Komponenty użytkowników
│   │   ├── Login.tsx        # Logowanie
│   │   ├── Register.tsx     # Rejestracja
│   │   └── ...
│   ├── context/             # React Context
│   ├── lib/                 # Biblioteki pomocnicze
│   ├── store/               # Zustand stores
│   ├── test/                # Konfiguracja testów
│   ├── types/               # TypeScript typy
│   └── ...
├── supabase/
│   ├── functions/           # Edge Functions
│   └── migrations/          # Migracje bazy danych
└── ...
```

## 🔐 Bezpieczeństwo

- **Row Level Security (RLS)** aktywne na wszystkich tabelach
- Autoryzacja JWT przez Supabase Auth
- Service Role Key używany tylko w Edge Functions
- Walidacja danych po stronie klienta i serwera

## 🧪 Uruchamianie testów

### Testy jednostkowe (Vitest)
```bash
npm run test          # Uruchom testy w trybie watch
npm run test:run      # Uruchom testy jednorazowo
npm run test:ui       # Uruchom testy z interfejsem graficznym
```

### Testy obejmują:
- **Komponenty layoutu:** Footer, Content
- **Komponenty logowania i rejestracji:** Login, Register
- **Komponenty zadań:** Settings (zakładki, przełączanie)
- **Komponenty użytkowników:** Settings (zakładki, przełączanie)
- **Komponenty pomocy i kontaktu:** Help, Contact

### Linting
```bash
npm run lint
```

## 🚀 Build produkcyjny

```bash
npm run build
npm run preview
```


## 📄 Licencja

Ten projekt jest licencjonowany na podstawie licencji MIT - zobacz plik [LICENSE](LICENSE) dla szczegółów.

## 👥 Autor

**Maxsoft** - [biuro@maxsoft.pl](mailto:biuro@maxsoft.pl)

## 🙏 Podziękowania

- [Supabase](https://supabase.com) za doskonały backend-as-a-service
- [TanStack Table](https://tanstack.com/table) za potężną bibliotekę tabel
- [Tailwind CSS](https://tailwindcss.com) za utility-first CSS framework