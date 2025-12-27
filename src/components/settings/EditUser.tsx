import { useState, useEffect } from 'react';
import { useUsersStore } from '../../store/usersStore';
import { supabaseAdmin } from '../../lib/supabase';
import type { User } from '../../types/user';

interface EditUserProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUser({ user, onClose, onSuccess }: EditUserProps) {
  const { updateUser, confirmUserEmail } = useUsersStore();
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    role: user.role,
    emailConfirmed: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(true);

  useEffect(() => {
    // Sprawdź status potwierdzenia email
    const checkEmailStatus = async () => {
      try {
        if (supabaseAdmin) {
          const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
          if (!error && users) {
            const authUser = users.users.find(u => u.id === user.id);
            setFormData(prev => ({
              ...prev,
              emailConfirmed: authUser?.email_confirmed_at !== null && authUser?.email_confirmed_at !== undefined,
            }));
          }
        }
      } catch (err) {
        console.error('Error checking email status:', err);
      } finally {
        setCheckingEmail(false);
      }
    };

    setFormData({
      full_name: user.full_name || '',
      role: user.role,
      emailConfirmed: false,
    });
    checkEmailStatus();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Najpierw zaktualizuj dane użytkownika
    const { error: updateError } = await updateUser(user.id, {
      full_name: formData.full_name,
      role: formData.role,
    });

    if (updateError) {
      setError(updateError.message || 'Błąd aktualizacji użytkownika.');
      setLoading(false);
      return;
    }

    // Jeśli checkbox emailConfirmed jest zaznaczony, potwierdź email
    if (formData.emailConfirmed) {
      const { error: confirmError } = await confirmUserEmail(user.id);
      if (confirmError) {
        setError(confirmError.message || 'Błąd potwierdzania email.');
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edytuj użytkownika</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Email nie może być zmieniony</p>
          </div>

          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
              Imię i nazwisko *
            </label>
            <input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Jan Kowalski"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Rola *
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            >
              <option value="user">Użytkownik</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {!checkingEmail && (
            <div className="flex items-center">
              <input
                id="emailConfirmed"
                type="checkbox"
                checked={formData.emailConfirmed}
                onChange={(e) => setFormData({ ...formData, emailConfirmed: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="emailConfirmed" className="ml-2 text-sm text-gray-700">
                Email potwierdzony
              </label>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

