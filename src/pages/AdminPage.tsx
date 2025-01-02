import { useState } from 'react';
import { GenresTable } from '../components/admin/genres/GenresTable';
import { TheatersTable } from '../components/admin/theaters/TheatersTable';
import { MoviesTable } from '../components/admin/movies/MoviesTable';
import { LoginPage } from './LoginPage';
import { getAccessToken } from '../services/auth-token.service';
import { ShowTimesTable } from '../components/admin/showtimes/ShowTimesTable';
import { PromoCodesTable } from '../components/admin/promocodes/PromoCodesTable';
import { ProductsTable } from '../components/admin/products/ProductsTable';
import { ProductCategoriesTable } from '../components/admin/products/ProductCategoriesTable';
import { UserRolesTable } from '../components/admin/role/UserRolesTable';
import { UsersTable } from '../components/admin/users/UsersTable';

type AdminTab =
  | 'genres'
  | 'theaters'
  | 'movies'
  | 'showtimes'
  | 'promocodes'
  | 'products'
  | 'productCategories'
  | 'users'
  | 'userRoles';

export function AdminPage() {
  const isAuthenticated  = getAccessToken();
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
        <button
          onClick={() => setActiveTab('movies')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
            ${
              activeTab === 'movies'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
            }`}
        >
          Управление фильмами
        </button>
        <button
          onClick={() => setActiveTab('showtimes')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
            ${
              activeTab === 'showtimes'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
            }`}
        >
          Управление сеансами
        </button>
        <button
          onClick={() => setActiveTab('promocodes')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
            ${
              activeTab === 'promocodes'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
            }`}
        >
          Управление промокодами
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
            ${
              activeTab === 'products'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
            }`}
        >
          Управление продуктами
        </button>
        <button
          onClick={() => setActiveTab('productCategories')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
            ${
              activeTab === 'productCategories'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
            }`}
        >
          Управление категориями продуктов
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
            ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
            }`}
        >
          Управление пользователями
        </button>
        <button
          onClick={() => setActiveTab('userRoles')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
            ${
              activeTab === 'userRoles'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
            }`}
        >
          Управление ролями пользователей
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
        ) : activeTab === 'theaters' ? (
          <>
            <h2
              className="text-lg md:text-xl font-semibold text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-400 to-pink-400"
            >
              Управление залами
            </h2>
            <TheatersTable />
          </>
        ) : activeTab === 'movies' ? (
          <>
            <h2
              className="text-lg md:text-xl font-semibold text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-400 to-pink-400"
            >
              Управление фильмами
            </h2>
            <MoviesTable />
          </>
        ) : activeTab === 'showtimes' ? (
          <>
            <h2
              className="text-lg md:text-xl font-semibold text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-400 to-pink-400"
            >
              Управление сеансами
            </h2>
            <ShowTimesTable />
          </>
        ) : activeTab === 'promocodes' ? (
          <>
            <h2
              className="text-lg md:text-xl font-semibold text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-400 to-pink-400"
            >
              Управление промокодами
            </h2>
            <PromoCodesTable />
          </>
        ) : activeTab === 'products' ? (
          <>
            <h2
              className="text-lg md:text-xl font-semibold text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-400 to-pink-400"
            >
              Управление продуктами
            </h2>
            <ProductsTable />
          </>
        ) : activeTab === 'productCategories' ? (
          <>
            <h2
              className="text-lg md:text-xl font-semibold text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-400 to-pink-400"
            >
              Управление категориями продуктов
            </h2>
            <ProductCategoriesTable />
          </>
        ) : activeTab === 'users' ? (
          <>
            <h2
              className="text-lg md:text-xl font-semibold text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-400 to-pink-400"
            >
              Управление пользователями
            </h2>
            <UsersTable />
          </>
        ) : (
          <>
            <h2
              className="text-lg md:text-xl font-semibold text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-400 to-pink-400"
            >
              Управление ролями пользователей
            </h2>
            <UserRolesTable />
          </>
        )}
      </div>
    </div>
  );
}
