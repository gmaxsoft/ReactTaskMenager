-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'Nie rozpoczęto' CHECK (status IN ('Nie rozpoczęto','W trakcie', 'Testowanie', 'Aktualizacja', 'Zakończenie')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Indeksy dla lepszej wydajności
-- =============================================
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON public.tasks(status);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON public.tasks(created_at);
CREATE INDEX IF NOT EXISTS tasks_start_date_idx ON public.tasks(start_date);
CREATE INDEX IF NOT EXISTS tasks_end_date_idx ON public.tasks(end_date);

-- =============================================
-- Automatyczne updated_at
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_tasks_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_tasks_updated_at();

-- =============================================
-- Polityki RLS
-- =============================================

-- 1. Użytkownicy widzą tylko swoje zadania
CREATE POLICY "Users can view own tasks"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 2. Użytkownicy mogą tworzyć tylko swoje zadania
CREATE POLICY "Users can insert own tasks"
  ON public.tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Użytkownicy mogą aktualizować tylko swoje zadania
CREATE POLICY "Users can update own tasks"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Użytkownicy mogą usuwać tylko swoje zadania
CREATE POLICY "Users can delete own tasks"
  ON public.tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. Admini widzą wszystkie zadania
CREATE POLICY "Admins can view all tasks"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 6. Admini mogą aktualizować wszystkie zadania
CREATE POLICY "Admins can update all tasks"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. Admini mogą usuwać wszystkie zadania
CREATE POLICY "Admins can delete all tasks"
  ON public.tasks
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

