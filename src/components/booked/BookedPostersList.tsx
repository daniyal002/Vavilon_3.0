import { BookedPosterCard } from './BookedPosterCard';
import { useBookedPosters } from '../../hooks/useBookedPosters';
import { useBookings } from '../../hooks/useBookings';
import { useEffect, useState } from 'react';
import { BookedPoster } from '../../types/bookedPoster';
import { Toaster } from 'react-hot-toast';

export function BookedPostersList() {
  // Используем хук для получения актуального списка броней
  const { bookedPosters } = useBookedPosters();
  const { useCheckConfirmation } = useBookings();
  const { mutate: checkConfirmation, data } = useCheckConfirmation();
  const [activePosters, setActivePosters] = useState<BookedPoster[]>([]);
  const [inactivePosters, setInactivePosters] = useState<BookedPoster[]>([]);
  const [showActive, setShowActive] = useState(true); // Состояние для переключения между активными и неактивными билетами

  useEffect(() => {
    const currentDateTime = new Date();

    setActivePosters(
      bookedPosters.filter((poster) => {
        const endTime = new Date(
          `${poster.date.split('T')[0]}T${poster.endTime}:00`
        );
        return endTime > currentDateTime;
      })
    );

    setInactivePosters(
      bookedPosters.filter((poster) => {
        const endTime = new Date(
          `${poster.date.split('T')[0]}T${poster.endTime}:00`
        );
        return endTime < currentDateTime;
      })
    );

    const checkArray = bookedPosters.map((booked) => ({
      showTimeId: Number(booked.id),
      phone: booked.phoneNumber,
    }));

    if (checkArray.length > 0) {
      checkConfirmation({ bookings: checkArray });
    }
  }, [bookedPosters, checkConfirmation]);

  if (bookedPosters.length === 0) {
    return (
      <div className="text-center py-12 text-purple-300">
        У вас пока нет забронированных билетов
      </div>
    );
  }

  return (
    <div>
      <Toaster/>
      <div className="flex justify-start mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => setShowActive(true)}
            className={`px-4 py-2 text-sm font-medium border transition-colors duration-300 outline-none ${
              showActive
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 hover:bg-purple-100'
            } border-purple-600`}
            aria-pressed={showActive}
          >
            Актуальные билеты
          </button>
          <button
            onClick={() => setShowActive(false)}
            className={`px-4 py-2 text-sm font-medium border transition-colors duration-300 outline-none ${
              !showActive
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 hover:bg-purple-100'
            } border-purple-600`}
            aria-pressed={!showActive}
          >
            Неактуальные билеты
          </button>
        </div>
      </div>

      {showActive ? (
        <>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePosters.map((poster) => (
              <BookedPosterCard
                key={poster.id}
                {...poster}
                confirmation={
                  data?.bookings.find(
                    (confirmation) =>
                      confirmation.phone === poster.phoneNumber &&
                      confirmation.showTimeId === Number(poster.id)
                  )?.confirmation as boolean
                }
              />
            ))}
          </div>
        </>
      ) : (
        <>
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactivePosters.map((poster) => (
              <BookedPosterCard
                key={poster.id}
                {...poster}
                confirmation={
                  data?.bookings.find(
                    (confirmation) =>
                      confirmation.phone === poster.phoneNumber &&
                      confirmation.showTimeId === Number(poster.id)
                  )?.confirmation as boolean
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
