-- Add active column to users table
-- 1 = użytkownik potwierdzony przez administratora
-- 0 = nie potwierdzony

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS active INTEGER DEFAULT 0 CHECK (active IN (0, 1));

-- Update existing users to be active by default (optional, można zmienić na 0 jeśli potrzeba)
UPDATE public.users SET active = 1 WHERE active IS NULL;

