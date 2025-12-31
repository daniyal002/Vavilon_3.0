import { useEffect, useState } from "react";
import { GenresTable } from "../components/admin/genres/GenresTable";
import { TheatersTable } from "../components/admin/theaters/TheatersTable";
import { MoviesTable } from "../components/admin/movies/MoviesTable";
import { getAccessToken } from "../services/auth-token.service";
import { ShowTimesTable } from "../components/admin/showtimes/ShowTimesTable";
import { PromoCodesTable } from "../components/admin/promocodes/PromoCodesTable";
import { ProductsTable } from "../components/admin/products/ProductsTable";
import { ProductCategoriesTable } from "../components/admin/products/ProductCategoriesTable";
import { UserRolesTable } from "../components/admin/role/UserRolesTable";
import { UsersTable } from "../components/admin/users/UsersTable";
import { ShowTimesBookingTable } from "../components/admin/showtimes/showTimesBooking/ShowTimesBookingTable";
import { Menu, X } from "lucide-react";
import BookingSummariesTable from "../components/admin/summariesByPhone/BookingSummariesTable";
import SettingsTable from "../components/admin/settings/SettingsTable";
import { useNavigate } from "react-router-dom";
import { subscribeToPushNotifications } from "../utils/pushNotifications";
import BookingNotifications from "../components/UI/BookingNotifications";
import { InstagramListShowtimes } from "../components/admin/instagramListShowtimes/InstagramListShowtimes";
import { SeatTypeTable } from "../components/admin/seatType/SeatTypeTable";

type AdminTab =
  | "genres"
  | "theaters"
  | "seatTypes"
  | "movies"
  | "showtimes"
  | "promocodes"
  | "products"
  | "productCategories"
  | "users"
  | "userRoles"
  | "bookings"
  | "bookingSummaries"
  | "settings"
  | "instagramList";

export function AdminPage() {
  const isAuthenticated = getAccessToken();
  const [activeTab, setActiveTab] = useState<AdminTab>("genres");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;

    const diff = touchStartX - e.changedTouches[0].clientX;

    if (diff > 60) {
      setSidebarOpen(false);
    }

    setTouchStartX(null);
  };

  useEffect(() => {
    if (!isSidebarOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSidebarOpen]);

  const navigationButtons = [
    { id: "genres", label: "Управление жанрами" },
    { id: "theaters", label: "Управление залами" },
    { id: "seatTypes", label: "Управление типами мест" },
    { id: "movies", label: "Управление фильмами" },
    { id: "showtimes", label: "Управление сеансами" },
    { id: "promocodes", label: "Управление промокодами" },
    { id: "products", label: "Управление продуктами" },
    { id: "productCategories", label: "Управление категориями продуктов" },
    { id: "users", label: "Управление пользователями" },
    { id: "userRoles", label: "Управление ролями пользователей" },
    { id: "bookings", label: "Управление бронированиями" },
    { id: "bookingSummaries", label: "Количество броней" },
    { id: "settings", label: "Настройки" },
    { id: "instagramList", label: "Инстаграм" },
  ];

  useEffect(() => {
    async function registerSubscription() {
      try {
        const subscription = await subscribeToPushNotifications();

        await fetch(
          `${import.meta.env.VITE_API_URL}/subscriptions/save-subscription`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscription }),
          }
        );

        console.log("Подписка успешно зарегистрирована");
      } catch (error) {
        console.error("Ошибка регистрации подписки:", error);
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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`
    fixed md:sticky
    top-0 left-0
    h-dvh
    w-64
    bg-purple-950/80 backdrop-blur-xl
    border-r border-purple-500/10
    z-50
    transform transition-all duration-300 ease-out
    flex flex-col
    ${
      isSidebarOpen
        ? "translate-x-0 opacity-100"
        : "-translate-x-full md:translate-x-0 opacity-100"
    }
  `}
      >
        {/* Header */}
        <div className="shrink-0 p-4 pt-16 md:pt-4 border-b border-purple-500/10">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Админ-панель
          </h1>
        </div>

        {/* Scrollable navigation */}
        <nav
          className="
      sidebar-scroll
      flex-1
      overflow-y-auto
      overscroll-contain
      scroll-smooth
      p-4
      space-y-2
    "
          style={{ WebkitOverflowScrolling: "touch" }}
        >
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
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
              : "text-purple-200 hover:bg-purple-900/50"
          }`}
            >
              {button.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Основной контент */}
      <div className="flex-1 p-4">
        <BookingNotifications />

        <div className="space-y-6">
          {activeTab === "genres" ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление жанрами
              </h2>
              <GenresTable />
            </>
          ) : activeTab === "theaters" ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление залами
              </h2>
              <TheatersTable />
            </>
          ) : activeTab === "seatTypes" ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление типами мест
              </h2>
              <SeatTypeTable />
            </>
          ) : activeTab === "movies" ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление фильмами
              </h2>
              <MoviesTable />
            </>
          ) : activeTab === "showtimes" ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление сеансами
              </h2>
              <ShowTimesTable />
            </>
          ) : activeTab === "promocodes" ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление промокодами
              </h2>
              <PromoCodesTable />
            </>
          ) : activeTab === "products" ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление продуктами
              </h2>
              <ProductsTable />
            </>
          ) : activeTab === "productCategories" ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление категориями продуктов
              </h2>
              <ProductCategoriesTable />
            </>
          ) : activeTab === "users" ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление пользователями
              </h2>
              <UsersTable />
            </>
          ) : activeTab === "userRoles" ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление ролями пользователей
              </h2>
              <UserRolesTable />
            </>
          ) : activeTab === "bookings" ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Управление бронированиями
              </h2>
              <ShowTimesBookingTable />
            </>
          ) : activeTab === "bookingSummaries" ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Количество броней
              </h2>
              <BookingSummariesTable />
            </>
          ) : activeTab === "settings" ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Настройки
              </h2>
              <SettingsTable />
            </>
          ) : (
            <>
              <h2 className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Настройки
              </h2>
              <InstagramListShowtimes />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
