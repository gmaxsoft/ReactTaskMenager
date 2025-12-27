import { create } from 'zustand';
import { supabase, supabaseAdmin } from '../lib/supabase';
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
      if (!supabaseAdmin) {
        return { error: new Error('Service role key not configured') };
      }

      // Utwórz użytkownika w auth używając admin client
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
        },
      });

      if (authError) {
        return { error: authError as Error };
      }

      // Profil użytkownika jest automatycznie tworzony przez trigger
      // Zaktualizuj role i active
      if (authData.user) {
        const updateData: { role?: string; active?: number } = {};
        if (userData.role) {
          updateData.role = userData.role;
        }
        // Nowi użytkownicy dodani przez admina są od razu aktywni
        updateData.active = 1;

        const { error: updateError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', authData.user.id);

        if (updateError) {
          return { error: updateError as Error };
        }
      }

      // Odśwież listę użytkowników
      await get().fetchUsers();

      return { error: null };
    } catch (error) {
      return { error: error as Error };
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

      // Jeśli active jest ustawione na 1, potwierdź email w auth.users
      if (userData.active === 1 && supabaseAdmin) {
        try {
          await supabaseAdmin.auth.admin.updateUserById(id, {
            email_confirm: true,
          });
        } catch (authError) {
          console.error('Error confirming email in auth.users:', authError);
          // Nie zwracamy błędu, bo aktualizacja w public.users się udała
        }
      }

      // Odśwież listę użytkowników
      await get().fetchUsers();

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  deleteUser: async (id) => {
    try {
      if (!supabaseAdmin) {
        return { error: new Error('Service role key not configured') };
      }

      // Usuń użytkownika z auth (to automatycznie usunie profil przez CASCADE)
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

      if (authError) {
        return { error: authError as Error };
      }

      // Odśwież listę użytkowników
      await get().fetchUsers();

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  confirmUserEmail: async (id) => {
    // Ta funkcja jest przestarzała, użyj updateUser z active: 1
    return { error: new Error('Use updateUser with active: 1 instead') };
  },
}));

