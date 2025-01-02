import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/movie';
import { baseURL } from '../api/axios';
import { MovieGenres } from './MovieGenres';

interface MovieDetailsProps {
  movie: Movie;
  onClose?: () => void;
}

export function MovieDetails({ movie, onClose }: MovieDetailsProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-purple-950/50 rounded-xl overflow-hidden shadow-lg">
      <div className="relative">
        {/* Постер */}
        <div className="relative h-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950 to-transparent opacity-50 z-10" />
          {/* Рейтинг */}
          <div className="absolute top-2 right-2 z-20">
            <span
              className="px-2 py-1 bg-yellow-500/80 rounded-md text-sm font-semibold
              transform transition-transform duration-300 hover:scale-110 hover:bg-yellow-500
              flex items-center gap-1"
            >
              ★ {movie.rating}
            </span>
          </div>
          {/* Возрастное ограничение */}
          <div className="absolute bottom-2 left-2 z-20">
            <span
              className="px-2 py-1 bg-purple-900/80 rounded-md text-sm font-semibold
              transform transition-all duration-300 hover:scale-110 hover:bg-purple-900
              hover:shadow-lg"
            >
              {movie.ageRestriction}
            </span>
          </div>
          <img
            src={`${baseURL}/${movie.imagePath}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Информация о фильме */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h1
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 
              text-transparent bg-clip-text animate-gradient"
            >
              {movie.title}
            </h1>
          </div>

          {/* Информация о годе и премьере */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-purple-300">Год:</span>
              <span className="text-sm text-purple-400">
                {movie.year}
              </span>
            </div>
            {movie.premiere && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-300">Статус:</span>
                <span className="px-2 md:px-3 py-1 rounded-full text-xs font-semibold bg-purple-800/50 text-amber-400 border border-purple-700/50 backdrop-blur-sm">
                  Премьера
                </span>
              </div>
            )}
          </div>

          {/* Жанры */}
          <div className="flex flex-wrap gap-2">
            <MovieGenres genres={movie.genres || []} />
          </div>

          {/* Описание */}
          <p className="text-purple-200/80 text-base leading-relaxed">
            {movie.description}
          </p>

          {/* Трейлер */}
          {movie.trailerLink && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src={movie.trailerLink}
                title={`Трейлер ${movie.title}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-6 bg-purple-600/80 rounded-lg font-semibold
                text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50
                transition-all duration-300 active:scale-95 hover:scale-[1.02]"
            >
              Назад
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 bg-gray-600/80 rounded-lg font-semibold
                  text-white shadow-lg shadow-gray-500/30 hover:shadow-gray-500/50
                  transition-all duration-300 active:scale-95 hover:scale-[1.02]"
              >
                Закрыть
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
