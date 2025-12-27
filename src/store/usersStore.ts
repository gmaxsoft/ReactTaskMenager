import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types/user';

interface UsersStore {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (userData: { email: string; password: string; full_name: string; role?: 'user' | 'admin' }) => Promise<{ error: Error | null }>;
  updateUser: (id: string, userData: Partial<User>) => Promise<{ error: Error | null }>;
  deleteUser: (id: string) => Promise<{ error: Error | null }>;
  confirmUserEmail: (id: string) => Promise<{ error: Error | null }>;
}

export const useUsersStore = create<UsersStore>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ users: data as User[], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error fetching users:', error);
    }
  },

  addUser: async (userData) => {
    // Uwaga: Tworzenie użytkowników wymaga Supabase Edge Function lub backend API
    // Service role key nie może być używany w przeglądarce ze względów bezpieczeństwa
    return { error: new Error('Dodawanie użytkowników wymaga backend API. Użyj Supabase Edge Function lub backend endpoint.') };
  },

  updateUser: async (id, userData) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id);

      if (error) {
        return { error: error as Error };
      }

      // Uwaga: Potwierdzanie email w auth.users wymaga backend API
      // Aby potwierdzić email, musisz wyłączyć wymaganie potwierdzenia email w ustawieniach Supabase
      // Settings -> Authentication -> Email Auth -> Disable "Confirm email"

      // Odśwież listę użytkowników
      await get().fetchUsers();

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  deleteUser: async (id) => {
    // Uwaga: Usuwanie użytkowników wymaga Supabase Edge Function lub backend API
    // Service role key nie może być używany w przeglądarce ze względów bezpieczeństwa
    return { error: new Error('Usuwanie użytkowników wymaga backend API. Użyj Supabase Edge Function lub backend endpoint.') };
  },

  confirmUserEmail: async (id) => {
    // Ta funkcja jest przestarzała, użyj updateUser z active: 1
    return { error: new Error('Use updateUser with active: 1 instead') };
  },
}));

