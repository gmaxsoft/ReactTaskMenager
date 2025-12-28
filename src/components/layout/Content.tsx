import { useEffect, useMemo } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useTaskStore } from '../../store/taskStore';
import UsersSettings from '../users/Settings';
import TasksSettings from '../tasks/Settings';

export default function Content() {
  const { currentView } = useNavigation();
  const { tasks, loading: tasksLoading, fetchTasks } = useTaskStore();

  useEffect(() => {
    if (currentView === 'dashboard') {
      fetchTasks();
    }
  }, [currentView, fetchTasks]);

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const inProgressTasks = tasks.filter(task => task.status === 'W trakcie').length;
    const completedTasks = tasks.filter(task => task.status === 'Zakończenie').length;

    return {
      totalTasks,
      inProgressTasks,
      completedTasks
    };
  }, [tasks]);

  const recentTasks = useMemo(() => {
    return tasks.slice(0, 5);
  }, [tasks]);

  if (currentView === 'users') {
    return (
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <UsersSettings />
      </main>
    );
  }

  if (currentView === 'tasks') {
    return (
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <TasksSettings />
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Wszystkie zadania</p>
                  <p className="text-3xl font-bold text-gray-800">{tasksLoading ? '...' : stats.totalTasks}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">W trakcie</p>
                  <p className="text-3xl font-bold text-gray-800">{tasksLoading ? '...' : stats.inProgressTasks}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ukończone</p>
                  <p className="text-3xl font-bold text-gray-800">{tasksLoading ? '...' : stats.completedTasks}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Ostatnie zadania</h3>
            </div>
            <div className="p-6">
              {tasksLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-600">Ładowanie zadań...</p>
                </div>
              ) : recentTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Brak zadań. Dodaj pierwsze zadanie!</p>
              ) : (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {task.description ? task.description.substring(0, 100) + (task.description.length > 100 ? '...' : '') : 'Brak opisu'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            task.priority === 'low' ? 'bg-green-100 text-green-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {task.priority === 'low' ? 'Niski' :
                             task.priority === 'medium' ? 'Średni' :
                             task.priority === 'high' ? 'Wysoki' : 'Pilny'}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            task.status === 'Nie rozpoczęto' ? 'bg-gray-100 text-gray-800' :
                            task.status === 'W trakcie' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'Testowanie' ? 'bg-purple-100 text-purple-800' :
                            task.status === 'Aktualizacja' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {task.user_name || 'Nieznany użytkownik'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(task.created_at).toLocaleDateString('pl-PL')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
