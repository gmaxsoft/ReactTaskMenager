import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Task, TaskCreate, TaskUpdate } from '../types/task';

interface TaskStore {
  tasks: Task[];
  users: { id: string; full_name: string }[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  addTask: (taskData: TaskCreate) => Promise<{ error: Error | null }>;
  updateTask: (id: string, taskData: TaskUpdate) => Promise<{ error: Error | null }>;
  deleteTask: (id: string) => Promise<{ error: Error | null }>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  users: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      // Pobierz zadania
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      // Pobierz unikalne user_ids
      const userIds = [...new Set(tasksData?.map(task => task.user_id) || [])];

      // Pobierz dane użytkowników
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name')
        .in('id', userIds);

      if (usersError) {
        console.warn('Error fetching users:', usersError);
        // Kontynuuj bez danych użytkowników
      }

      // Utwórz mapę użytkowników
      const usersMap = new Map();
      usersData?.forEach(user => {
        usersMap.set(user.id, user.full_name);
      });

      // Połącz dane
      const tasksWithUser = tasksData?.map(task => ({
        ...task,
        user_name: usersMap.get(task.user_id) || 'Nieznany użytkownik'
      })) || [];

      set({ tasks: tasksWithUser as Task[], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error fetching tasks:', error);
    }
  },

  fetchUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name')
        .eq('active', 1)
        .order('full_name');

      if (error) throw error;

      set({ users: data || [] });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  },

  addTask: async (taskData) => {
    try {
      // Get current session to ensure token is passed
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return { error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase.functions.invoke('add-task', {
        body: taskData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('Error invoking add-task function:', error);
        return { error: new Error(error.message || 'Failed to add task') };
      }

      // Check if response contains an error
      if (data && typeof data === 'object' && 'error' in data) {
        console.error('Error from add-task function:', data.error);
        return { error: new Error(data.error || 'Failed to add task') };
      }

      // Odśwież listę zadań
      await get().fetchTasks();

      return { error: null };
    } catch (error) {
      console.error('Exception in addTask:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error occurred') };
    }
  },

  updateTask: async (id, taskData) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', id);

      if (error) {
        return { error: error as Error };
      }

      // Odśwież listę zadań
      await get().fetchTasks();

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  deleteTask: async (id) => {
    try {
      // Get current session to ensure token is passed
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return { error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase.functions.invoke('delete-task', {
        body: { id },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('Error invoking delete-task function:', error);
        return { error: new Error(error.message || 'Failed to delete task') };
      }

      // Check if response contains an error
      if (data && typeof data === 'object' && 'error' in data) {
        console.error('Error from delete-task function:', data.error);
        return { error: new Error(data.error || 'Failed to delete task') };
      }

      // Odśwież listę zadań
      await get().fetchTasks();

      return { error: null };
    } catch (error) {
      console.error('Exception in deleteTask:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error occurred') };
    }
  },
}));







