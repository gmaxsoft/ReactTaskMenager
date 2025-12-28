import { useState } from 'react';
import UsersTable from './UsersTable';
import AddUser from './AddUser';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Ustawienia</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'list'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Lista użytkowników
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'add'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dodaj użytkownika
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'list' && <UsersTable />}
        {activeTab === 'add' && <AddUser onSuccess={() => setActiveTab('list')} />}
      </div>
    </div>
  );
}







