import { useState, useEffect } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';

interface AddTaskProps {
  onSuccess: () => void;
}

export default function AddTask({ onSuccess }: AddTaskProps) {
  const { addTask, users, fetchUsers } = useTaskStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    status: 'Nie rozpoczęto' as 'Nie rozpoczęto' | 'W trakcie' | 'Testowanie' | 'Aktualizacja' | 'Zakończenie',
    user_id: user?.id || '',
    start_date: '',
    end_date: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.user_id) {
      setError('Użytkownik musi być wybrany.');
      return;
    }

    if (!formData.title.trim()) {
      setError('Tytuł zadania jest wymagany.');
      return;
    }

    setLoading(true);

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      priority: formData.priority,
      status: formData.status,
      user_id: formData.user_id,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
    };

    const { error } = await addTask(taskData);

    setLoading(false);

    if (error) {
      setError(error.message || 'Błąd dodawania zadania.');
    } else {
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'Nie rozpoczęto',
        user_id: user?.id || '',
        start_date: '',
        end_date: '',
      });
      onSuccess();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dodaj nowe zadanie</h2>

      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Tytuł *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="Wpisz tytuł zadania"
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Opis
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="Wpisz opis zadania (opcjonalne)"
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-2">
            Użytkownik *
          </label>
          <select
            id="user_id"
            value={formData.user_id}
            onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Wybierz użytkownika</option>
            {users.map((userOption) => (
              <option key={userOption.id} value={userOption.id}>
                {userOption.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priorytet *
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            >
              <option value="low">Niski</option>
              <option value="medium">Średni</option>
              <option value="high">Wysoki</option>
              <option value="urgent">Pilny</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            >
              <option value="Nie rozpoczęto">Nie rozpoczęto</option>
              <option value="W trakcie">W trakcie</option>
              <option value="Testowanie">Testowanie</option>
              <option value="Aktualizacja">Aktualizacja</option>
              <option value="Zakończenie">Zakończenie</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
              Data rozpoczęcia
            </label>
            <input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
              Data zakończenia
            </label>
            <input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onSuccess}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Dodawanie...' : 'Dodaj zadanie'}
          </button>
        </div>
      </form>
    </div>
  );
}