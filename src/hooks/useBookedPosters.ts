import { useState, useEffect } from 'react';

interface BookedPoster {
  id: string;
  movieId: string;
  title: string;
  imageUrl: string;
  showtime: string;
  seats: number;
  phoneNumber: string;
  totalPrice: number;
  bookingDate: string;
}

// Создаем кастомное событие для синхронизации между вкладками
const STORAGE_EVENT = 'BOOKED_POSTERS_UPDATE';

export function useBookedPosters() {
  const [bookedPosters, setBookedPosters] = useState<BookedPoster[]>(() => {
    // Инициализируем состояние данными из localStorage
    const saved = localStorage.getItem('bookedPosters');
    return saved ? JSON.parse(saved) : [];
  });

  // Слушаем изменения в localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bookedPosters') {
        const newValue = e.newValue ? JSON.parse(e.newValue) : [];
        setBookedPosters(newValue);
      }
    };

    // Слушаем кастомное событие для обновления в той же вкладке
    const handleCustomEvent = (e: CustomEvent) => {
      setBookedPosters(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(STORAGE_EVENT, handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(STORAGE_EVENT, handleCustomEvent as EventListener);
    };
  }, []);

  const addBookedPoster = (poster: BookedPoster) => {
    const updatedPosters = [...bookedPosters, poster];
    setBookedPosters(updatedPosters);
    localStorage.setItem('bookedPosters', JSON.stringify(updatedPosters));
    // Вызываем кастомное событие для обновления всех компонентов
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: updatedPosters }));
  };

  const removeBookedPoster = (posterId: string) => {
    const updatedPosters = bookedPosters.filter(poster => poster.id !== posterId);
    setBookedPosters(updatedPosters);
    localStorage.setItem('bookedPosters', JSON.stringify(updatedPosters));
    // Вызываем кастомное событие для обновления всех компонентов
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: updatedPosters }));
  };

  const editBookedPoster = (posterId: string, updatedPoster: Partial<BookedPoster>) => {
    const updatedPosters = bookedPosters.map(poster => 
      poster.id === posterId 
        ? { ...poster, ...updatedPoster }
        : poster
    );
    setBookedPosters(updatedPosters);
    localStorage.setItem('bookedPosters', JSON.stringify(updatedPosters));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: updatedPosters }));
  };

  return { 
    bookedPosters, 
    addBookedPoster, 
    removeBookedPoster,
    editBookedPoster
  };
}