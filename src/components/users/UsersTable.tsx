import { useEffect, useState, useMemo } from 'react';
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
import { useUsersStore } from '../../store/usersStore';
import type { User } from '../../types/user';
import EditUser from './EditUser';

export default function UsersTable() {
  const { users, loading, fetchUsers, deleteUser } = useUsersStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      return;
    }

    setDeletingUserId(id);
    const { error } = await deleteUser(id);
    setDeletingUserId(null);

    if (error) {
      alert(`Błąd usuwania: ${error.message}`);
    }
  };

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'full_name',
        header: 'Imię i nazwisko',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'role',
        header: 'Rola',
        cell: (info) => {
          const role = info.getValue() as string;
          return (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                role === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {role === 'admin' ? 'Administrator' : 'Użytkownik'}
            </span>
          );
        },
      },
      {
        accessorKey: 'active',
        header: 'Status',
        cell: (info) => {
          const active = info.getValue() as number;
          return (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                active === 1
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {active === 1 ? 'Aktywny' : 'Nieaktywny'}
            </span>
          );
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
          const user = info.row.original;
          return (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingUser(user)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Edytuj
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => handleDelete(user.id)}
                disabled={deletingUserId === user.id}
                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
              >
                {deletingUserId === user.id ? 'Usuwanie...' : 'Usuń'}
              </button>
            </div>
          );
        },
      },
    ],
    [deletingUserId]
  );

  const table = useReactTable({
    data: users,
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
        <p className="mt-2 text-gray-600">Ładowanie użytkowników...</p>
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
                    Brak użytkowników
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

      {editingUser && (
        <EditUser
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            fetchUsers();
          }}
        />
      )}
    </>
  );
}

