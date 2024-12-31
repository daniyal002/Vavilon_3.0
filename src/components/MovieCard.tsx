import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/movie';
import { MovieInfo } from './MovieInfo';
import { MovieGenres } from './MovieGenres';
import { BookingForm } from './BookingForm';
import { BookedPoster } from '../types/bookedPoster';

type MovieCardProps = Movie;

export function MovieCard(movie: MovieCardProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookedPoster | null>(null);
  const navigate = useNavigate();

  const checkBookingStatus = () => {
    const bookedMovies = JSON.parse(localStorage.getItem('bookedPosters') || '[]');
    const booking = bookedMovies.find((booking: any) => booking.movieId === movie.id);
    setCurrentBooking(booking || null);
    setIsBooked(!!booking);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBookingSuccess = () => {
    checkBookingStatus();
  };

  const handleButtonClick = () => {
    setIsBooking(true);
  };

  useEffect(() => {
    checkBookingStatus();
  }, [movie.id]);

  return (
    <div className="group bg-purple-950/50 rounded-xl overflow-hidden shadow-lg">
      {(isBooking || isEditing) ? (
        <BookingForm 
          movie={movie} 
          onCancel={() => {
            setIsBooking(false);
            setIsEditing(false);
          }}
          onClose={() => {
            setIsBooking(false);
            setIsEditing(false);
          }}
          onSuccess={handleBookingSuccess}
          editMode={isEditing}
          initialBooking={currentBooking || undefined}
        />
      ) : (
        <>
          {/* Poster Section */}
          <div className="relative h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-950 to-transparent opacity-50 z-10" />
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Content Section */}
          <div className="p-6 flex flex-col flex-grow">
            <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 
              text-transparent bg-clip-text animate-gradient">
              {movie.title}
            </h2>

            <MovieGenres genres={movie.genres} />
            <p className="text-purple-200/80 mb-4 text-sm line-clamp-3">
              {movie.description}
            </p>
            <MovieInfo showtime={movie.showtime} price={movie.price} />

            <div className="mt-auto flex gap-2">
              <button
                onClick={isBooked ? handleEditClick : handleButtonClick}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white shadow-lg
                  transition-all duration-300 active:scale-95 hover:scale-[1.02]
                  ${isBooked 
                    ? 'bg-green-600 shadow-green-500/30 hover:shadow-green-500/50' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-500/30 hover:shadow-purple-500/50'
                  }`}
              >
                {isBooked ? 'Редактировать' : 'Забронировать'}
              </button>
              {isBooked && (
                <button
                  onClick={() => navigate('/booked')}
                  className="py-3 px-6 rounded-lg font-semibold text-white 
                    bg-purple-600 shadow-purple-500/30 hover:shadow-purple-500/50
                    transition-all duration-300 active:scale-95 hover:scale-[1.02]"
                >
                  Просмотр
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}