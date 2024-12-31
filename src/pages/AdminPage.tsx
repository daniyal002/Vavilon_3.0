import { useState } from 'react';
import { GenresTable } from '../components/admin/genres/GenresTable';
import { TheatersTable } from '../components/admin/theaters/TheatersTable';
import { LoginPage } from './LoginPage';

type AdminTab = 'genres' | 'theaters';

export function AdminPage() {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const [activeTab, setActiveTab] = useState<AdminTab>('genres');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1
        className="text-xl md:text-2xl font-bold mb-6 text-transparent bg-clip-text 
        bg-gradient-to-r from-purple-400 to-pink-400"
      >
        Админ-панель
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('genres')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
            ${
              activeTab === 'genres'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
            }`}
        >
          Управление жанрами
        </button>
        <button
          onClick={() => setActiveTab('theaters')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
            ${
              activeTab === 'theaters'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
            }`}
        >
          Управление залами
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === 'genres' ? (
          <>
            <h2
              className="text-lg md:text-xl font-semibold text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-400 to-pink-400"
            >
              Управление жанрами
            </h2>
            <GenresTable />
          </>
        ) : (
          <>
            <h2
              className="text-lg md:text-xl font-semibold text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-400 to-pink-400"
            >
              Управление залами
            </h2>
            <TheatersTable />
          </>
        )}
      </div>
    </div>
  );
}
