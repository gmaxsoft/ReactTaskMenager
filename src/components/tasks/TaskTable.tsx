import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { useTaskStore } from '../../store/taskStore';
import type { Task } from '../../types/task';
import EditTask from './EditTask';
import { useAuthStore } from '../../store/authStore';

export default function TaskTable() {
  const { tasks, loading, fetchTasks, deleteTask } = useTaskStore();
  const { user } = useAuthStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć to zadanie?')) {
      return;
    }

    setDeletingTaskId(id);
    const { error } = await deleteTask(id);
    setDeletingTaskId(null);

    if (error) {
      alert(`Błąd usuwania: ${error.message}`);
    }
  }, [deleteTask]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'Niski';
      case 'medium':
        return 'Średni';
      case 'high':
        return 'Wysoki';
      case 'urgent':
        return 'Pilny';
      default:
        return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nie rozpoczęto':
        return 'bg-gray-100 text-gray-800';
      case 'W trakcie':
        return 'bg-blue-100 text-blue-800';
      case 'Testowanie':
        return 'bg-purple-100 text-purple-800';
      case 'Aktualizacja':
        return 'bg-yellow-100 text-yellow-800';
      case 'Zakończenie':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Tytuł',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'user_name',
        header: 'Użytkownik',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'description',
        header: 'Opis',
        cell: (info) => {
          const description = info.getValue() as string;
          return description ? (
            <div className="max-w-xs truncate" title={description}>
              {description}
            </div>
          ) : (
            '-'
          );
        },
      },
      {
        accessorKey: 'priority',
        header: 'Priorytet',
        cell: (info) => {
          const priority = info.getValue() as string;
          return (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(priority)}`}
            >
              {getPriorityLabel(priority)}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue() as string;
          return (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'start_date',
        header: 'Data rozpoczęcia',
        cell: (info) => {
          const date = info.getValue() as string;
          return date ? new Date(date).toLocaleDateString('pl-PL') : '-';
        },
      },
      {
        accessorKey: 'end_date',
        header: 'Data zakończenia',
        cell: (info) => {
          const date = info.getValue() as string;
          return date ? new Date(date).toLocaleDateString('pl-PL') : '-';
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Data utworzenia',
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return date.toLocaleDateString('pl-PL');
        },
      },
      {
        id: 'actions',
        header: 'Akcje',
        cell: (info) => {
          const task = info.row.original;
          const isOwner = user?.id === task.user_id;
          const isAdmin = user?.role === 'admin';

          // Użytkownicy mogą edytować swoje zadania, admini wszystkie
          if (!isOwner && !isAdmin) {
            return null;
          }

          return (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingTask(task)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Edytuj
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => handleDelete(task.id)}
                disabled={deletingTaskId === task.id}
                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
              >
                {deletingTaskId === task.id ? 'Usuwanie...' : 'Usuń'}
              </button>
            </div>
          );
        },
      },
    ],
    [deletingTaskId, user, handleDelete]
  );

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-gray-600">Ładowanie zadań...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center space-x-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="text-gray-400">
                            {{
                              asc: ' ↑',
                              desc: ' ↓',
                            }[header.column.getIsSorted() as string] ?? ' ⇅'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                    Brak zadań
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Poprzednia
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Następna
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Strona <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> z{' '}
                <span className="font-medium">{table.getPageCount()}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Poprzednia
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Następna
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {editingTask && (
        <EditTask
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSuccess={() => {
            setEditingTask(null);
            fetchTasks();
          }}
        />
      )}
    </>
  );
}