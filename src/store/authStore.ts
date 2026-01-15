import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types/user';
import type { Session } from '@supabase/auth-js';

interface AuthStore {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  loading: true,

  initialize: async () => {
    try {
      // Sprawdź aktualną sesję
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Pobierz profil użytkownika
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        set({ session, user: profile as User, loading: false });
      } else {
        set({ session: null, user: null, loading: false });
      }

      // Nasłuchuj zmian w autentykacji
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!error && profile) {
            set({ session, user: profile as User, loading: false });
          } else {
            set({ session, user: null, loading: false });
          }
        } else {
          set({ session: null, user: null, loading: false });
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ session: null, user: null, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error as Error };
      }

      if (data.session && data.user) {
        // Pobierz profil użytkownika
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          return { error: profileError as Error };
        }

        // Sprawdź czy użytkownik jest aktywny (potwierdzony przez admina)
        if (profile.active === 0) {
          return { error: new Error('Konto nie zostało jeszcze potwierdzone przez administratora.') };
        }

        set({ session: data.session, user: profile as User, loading: false });
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      // Używamy zwykłego signUp, ale email będzie wymagał potwierdzenia przez admina
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error: error as Error };
      }

      // Użytkownik został utworzony, ale email nie jest potwierdzony
      // Admin będzie mógł potwierdzić email w ustawieniach
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, loading: false });
  },
}));

