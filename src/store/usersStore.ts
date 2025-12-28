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
    try {
      // Get current session to ensure token is passed
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase.functions.invoke('add-user', {
        body: userData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('Error invoking add-user function:', error);
        return { error: new Error(error.message || 'Failed to add user') };
      }

      // Check if response contains an error
      if (data && typeof data === 'object' && 'error' in data) {
        console.error('Error from add-user function:', data.error);
        return { error: new Error(data.error || 'Failed to add user') };
      }

      // Odśwież listę użytkowników
      await get().fetchUsers();

      return { error: null };
    } catch (error) {
      console.error('Exception in addUser:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error occurred') };
    }
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
    try {
      // Get current session to ensure token is passed
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { id },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('Error invoking delete-user function:', error);
        return { error: new Error(error.message || 'Failed to delete user') };
      }

      // Check if response contains an error
      if (data && typeof data === 'object' && 'error' in data) {
        console.error('Error from delete-user function:', data.error);
        return { error: new Error(data.error || 'Failed to delete user') };
      }

      // Odśwież listę użytkowników
      await get().fetchUsers();

      return { error: null };
    } catch (error) {
      console.error('Exception in deleteUser:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error occurred') };
    }
  },

  confirmUserEmail: async (_id) => {
    // Ta funkcja jest przestarzała, użyj updateUser z active: 1
    return { error: new Error('Use updateUser with active: 1 instead') };
  },
}));

