export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'Nie rozpoczęto' | 'W trakcie' | 'Testowanie' | 'Aktualizacja' | 'Zakończenie';
  user_id: string;
  user_name?: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'Nie rozpoczęto' | 'W trakcie' | 'Testowanie' | 'Aktualizacja' | 'Zakończenie';
  user_id: string;
  start_date?: string | null;
  end_date?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'Nie rozpoczęto' | 'W trakcie' | 'Testowanie' | 'Aktualizacja' | 'Zakończenie';
  user_id?: string;
  start_date?: string | null;
  end_date?: string | null;
}



