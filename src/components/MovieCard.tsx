import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieInfo } from './MovieInfo';
import { MovieGenres } from './MovieGenres';
import { BookingForm } from './BookingForm';
import { BookedPoster } from '../types/bookedPoster';
import { ShowTime } from '../types/showtime';
import { baseURL } from '../api/axios';
import { formatTime } from '../utils/formatters';
import { useBookings } from '../hooks/useBookings';
import { useBookedPosters } from '../hooks/useBookedPosters';
import { useQueryClient } from '@tanstack/react-query';
import { toast, Toaster } from 'react-hot-toast';

type MovieCardProps = ShowTime;

export function MovieCard(showTime: MovieCardProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookedPoster | null>(
    null
  );
  const navigate = useNavigate();
  const { deleteBookingMutation } = useBookings();
  const { removeBookedPoster } = useBookedPosters();
  const { mutate: deleteBooking } = deleteBookingMutation;
  const queryClient = useQueryClient();

  const checkBookingStatus = () => {
    const bookedMovies = JSON.parse(
      localStorage.getItem('bookedPosters') || '[]'
    );
    const booking = bookedMovies.find(
      (booking: BookedPoster) => booking.id === showTime.id.toString()
    );
    setCurrentBooking(booking || null);
  };

  const handleBookingSuccess = () => {
    checkBookingStatus();
  };

  const handleBookingClick = () => {
    if (showTime.availableSeats === 0 && !currentBooking) {
      toast.error('Все места заняты');
      return;
    }
    setIsBooking(true);
  };

  useEffect(() => {
    checkBookingStatus();
  }, [showTime.id]);

  return (
    <div
      className="group bg-purple-900/40 rounded-xl overflow-hidden shadow-lg 
      backdrop-blur-sm border border-purple-500/10 hover:border-purple-500/20 
      transition-all duration-300"
    >
      {isBooking ? (
        <BookingForm
          showTime={showTime}
          onCancel={() => setIsBooking(false)}
          onClose={() => setIsBooking(false)}
          onSuccess={handleBookingSuccess}
        />
      ) : (
        <>
          {/* Poster Section */}
          <div
            className="relative h-[380px] overflow-hidden cursor-pointer"
            onClick={() => navigate(`/movies/${showTime.movie.id}`)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-purple-950 to-transparent opacity-50 z-10" />
            <div className="absolute top-2 right-2 z-20">
              <span
                className="px-2 py-1 bg-yellow-500/80 rounded-md text-sm font-semibold
                transform transition-transform duration-300 hover:scale-110 hover:bg-yellow-500
                flex items-center gap-1"
              >
                ★ {showTime.movie.rating}
              </span>
            </div>
            <div className="absolute bottom-2 left-2 z-20">
              <span
                className="px-2 py-1 bg-purple-900/80 rounded-md text-sm font-semibold
                transform transition-all duration-300 hover:scale-110 hover:bg-purple-900
                hover:shadow-lg"
              >
                {showTime.movie.ageRestriction}
              </span>
            </div>
            <img
              src={`${baseURL}/${showTime.movie.imagePath}`}
              alt={showTime.movie.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Content Section */}
          <div className="p-6 flex flex-col flex-grow justify-between">
            <h2
              className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 
              text-transparent bg-clip-text animate-gradient"
              onClick={() => navigate(`/movies/${showTime.movie.id}`)}
            >
              {showTime.movie.title}
            </h2>

            <MovieGenres genres={showTime.movie.genres || []} />
            <p className="text-purple-200/80 mb-4 text-sm line-clamp-3">
              {showTime.movie.description}
            </p>
            <MovieInfo
              showtime={formatTime(showTime.startTime.toString())}
              price={showTime.price}
            />

            <div className="mt-auto flex gap-2">
              {currentBooking ? (
                <>
                  <button
                    onClick={() => navigate('/booked')}
                    className="flex-1 py-3 px-6 rounded-lg font-semibold text-white 
                      bg-purple-600 shadow-purple-500/30 hover:shadow-purple-500/50
                      transition-all duration-300 active:scale-95 hover:scale-[1.02]"
                  >
                    Просмотр
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          'Вы уверены, что хотите отменить бронирование?'
                        )
                      ) {
                        deleteBooking(
                          {
                            id: parseInt(currentBooking.id),
                            phone: currentBooking.phoneNumber,
                          },
                          {
                            onSuccess() {
                              removeBookedPoster(currentBooking.id);
                              queryClient.invalidateQueries({
                                queryKey: ['showTimes'],
                              });
                            },
                          }
                        );
                        setCurrentBooking(null);
                      }
                    }}
                    className="py-3 px-6 rounded-lg font-semibold text-white 
                      bg-red-600 shadow-red-500/30 hover:shadow-red-500/50
                      transition-all duration-300 active:scale-95 hover:scale-[1.02]"
                  >
                    Отменить
                  </button>
                </>
              ) : (
                <button
                  onClick={handleBookingClick}
                  disabled={showTime.seatsAvailable === 0}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold text-white
                    bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-500/30 
                    hover:shadow-purple-500/50 transition-all duration-300 
                    active:scale-95 hover:scale-[1.02]
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Забронировать
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
