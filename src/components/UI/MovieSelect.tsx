import React, { useEffect, useState } from 'react';
import { Movie } from '../../types/movie';

interface MovieSelectProps {
  movies: Movie[];
  selectedMovieId: string;
  onChange: (movieId: string) => void;
  isLabel: boolean;
}

const MovieSelect: React.FC<MovieSelectProps> = ({ movies, selectedMovieId, onChange, isLabel }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Фильтруем фильмы по поисковому запросу
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Обновляем searchQuery при изменении selectedMovieId
  useEffect(() => {
    const selectedMovie = movies.find(movie => String(movie.id) === selectedMovieId);
    if (selectedMovie) {
      setSearchQuery(selectedMovie.title);
    } else {
      setSearchQuery(''); // Если фильм не найден, очищаем поле
    }
  }, [selectedMovieId, movies]);

  return (
    <div className="relative">
      {isLabel && (
        <label className="block text-sm text-purple-300 mb-1">Фильм</label>
      )}
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск фильма..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)} // Задержка для обработки клика
          className="w-full p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
        />
        {isDropdownOpen && (
          <div className="absolute z-10 w-full bg-purple-900 border border-purple-700 rounded-lg mt-1 max-h-60 overflow-y-auto">
            {filteredMovies.length > 0 ? (
              filteredMovies.map(movie => (
                <div
                  key={movie.id}
                  onMouseDown={() => {
                    onChange(String(movie.id)); // Выбор фильма
                    setSearchQuery(movie.title); // Установка названия в поле ввода
                    setIsDropdownOpen(false); // Закрытие выпадающего списка
                  }}
                  className={`p-3 text-purple-200 cursor-pointer hover:bg-purple-800/50 ${
                    selectedMovieId === String(movie.id) ? 'bg-purple-600' : ''
                  }`}
                >
                  {movie.title}
                </div>
              ))
            ) : (
              <div className="p-3 text-purple-400">Фильмы не найдены</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieSelect;