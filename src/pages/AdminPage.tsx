import { useEffect, useState } from 'react';
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
import { ShowTimesBookingTable } from '../components/admin/showtimes/showTimesBooking/ShowTimesBookingTable';
import { Menu, X } from 'lucide-react';
import BookingSummariesTable from '../components/admin/summariesByPhone/BookingSummariesTable';
import SettingsTable from '../components/admin/settings/SettingsTable';
import { useNavigate } from 'react-router-dom';
import { subscribeToPushNotifications } from '../utils/pushNotifications';

type AdminTab =
  | 'genres'
  | 'theaters'
  | 'movies'
  | 'showtimes'
  | 'promocodes'
  | 'products'
  | 'productCategories'
  | 'users'
  | 'userRoles'
  | 'bookings'
  | 'bookingSummaries'
  | 'settings';

export function AdminPage() {
  const isAuthenticated = getAccessToken();
  const [activeTab, setActiveTab] = useState<AdminTab>('genres');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if(!isAuthenticated){
    return null
  }

  const navigationButtons = [
    { id: 'genres', label: 'Управление жанрами' },
    { id: 'theaters', label: 'Управление залами' },
    { id: 'movies', label: 'Управление фильмами' },
    { id: 'showtimes', label: 'Управление сеансами' },
    { id: 'promocodes', label: 'Управление промокодами' },
    { id: 'products', label: 'Управление продуктами' },
    { id: 'productCategories', label: 'Управление категориями продуктов' },
    { id: 'users', label: 'Управление пользователями' },
    { id: 'userRoles', label: 'Управление ролями пользователей' },
    { id: 'bookings', label: 'Управление бронированиями' },
    { id:'bookingSummaries', label: 'Количество броней'},
    {id:'settings',label: 'Настройки'}
  ];



useEffect(() => {
  async function registerSubscription() {
    try {

      const subscription = await subscribeToPushNotifications();


      await fetch(`${import.meta.env.VITE_API_URL}/subscriptions/save-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription }),
      });

      console.log('Подписка успешно зарегистрирована');
    } catch (error) {
      console.error('Ошибка регистрации подписки:', error);
    }
  }

  registerSubscription();
}, []);
  return (
    <div className="relative min-h-screen md:flex">
      {/* Кнопка открытия сайдбара на мобильных */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-purple-900/50 rounded-lg text-purple-400"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Затемнение фона */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Сайдбар */}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-purple-950/80 backdrop-blur-xl
          border-r border-purple-500/10 transform transition-transform duration-300 z-50
          overflow-y-auto md:overflow-y-visible
          ${
            isSidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full md:translate-x-0'
          }`}
      >
        <div className="p-4 pt-16 md:pt-4">
          <h1 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Админ-панель
          </h1>
          <nav className="space-y-2 pb-4">
            {navigationButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => {
                  setActiveTab(button.id as AdminTab);
                  setSidebarOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-lg transition-all duration-200 text-left text-sm
                  ${
                    activeTab === button.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-purple-200 hover:bg-purple-900/50'
                  }`}
              >
                {button.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 p-4">
        <div className="space-y-6">
          {activeTab === 'genres' ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление жанрами
              </h2>
              <GenresTable />
            </>
          ) : activeTab === 'theaters' ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление залами
              </h2>
              <TheatersTable />
            </>
          ) : activeTab === 'movies' ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление фильмами
              </h2>
              <MoviesTable />
            </>
          ) : activeTab === 'showtimes' ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление сеансами
              </h2>
              <ShowTimesTable />
            </>
          ) : activeTab === 'promocodes' ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление промокодами
              </h2>
              <PromoCodesTable />
            </>
          ) : activeTab === 'products' ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление продуктами
              </h2>
              <ProductsTable />
            </>
          ) : activeTab === 'productCategories' ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление категориями продуктов
              </h2>
              <ProductCategoriesTable />
            </>
          ) : activeTab === 'users' ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление пользователями
              </h2>
              <UsersTable />
            </>
          ) : activeTab === 'userRoles' ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление ролями пользователей
              </h2>
              <UserRolesTable />
            </>
          ) : activeTab === 'bookings' ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление бронированиями
              </h2>
              <ShowTimesBookingTable />
            </>
          ) : activeTab === 'bookingSummaries' ? (
            <>
            <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Количество броней
            </h2>
            <BookingSummariesTable />
          </>
          ): (
            <>
            <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Настройки
            </h2>
            <SettingsTable />
          </>
          )}
        </div>
      </div>
    </div>
  );
}
