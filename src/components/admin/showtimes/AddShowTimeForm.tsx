import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Movie } from '../../../types/movie';
import { Theater } from '../../../types/theater';

interface AddShowTimeFormProps {
  onAdd: (showTimeData: {
    movieId: number;
    theaterId: number;
    startTime: string;
    endTime: string;
    price: number;
    date: string;
    seatsAvailable: number;
  }) => void;
  isLoading: boolean;
  movies: Movie[];
  theaters: Theater[];
}

export function AddShowTimeForm({
  onAdd,
  isLoading,
  movies,
  theaters,
}: AddShowTimeFormProps) {
  const [formData, setFormData] = useState({
    movieId: '',
    theaterId: '',
    startTime: '',
    endTime: '',
    price: '',
    date: '',
    seatsAvailable: '',
  });

  const handleSubmit = () => {
    if (formData.movieId && formData.theaterId && formData.date) {
      onAdd({
        ...formData,
        movieId: parseInt(formData.movieId),
        theaterId: parseInt(formData.theaterId),
        price: parseFloat(formData.price),
        seatsAvailable: parseInt(formData.seatsAvailable),
      });
      setFormData({
        movieId: '',
        theaterId: '',
        startTime: '',
        endTime: '',
        price: '',
        date: '',
        seatsAvailable: '',
      });
    }
  };

  return (
    <div className="bg-purple-950/50 rounded-xl p-4 shadow-lg">
      <h3 className="text-base font-semibold text-purple-200 mb-4">
        Добавить новый сеанс
      </h3>

      <div className="space-y-4">
        {/* Фильм */}
        <div>
          <label className="block text-sm text-purple-300 mb-1">Фильм</label>
          <select
            value={formData.movieId}
            onChange={(e) =>
              setFormData({ ...formData, movieId: e.target.value })
            }
            className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
              text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
          >
            <option value="">Выберите фильм</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        {/* Зал */}
        <div>
          <label className="block text-sm text-purple-300 mb-1">Зал</label>
          <select
            value={formData.theaterId}
            onChange={(e) =>
              setFormData({ ...formData, theaterId: e.target.value })
            }
            className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
              text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
          >
            <option value="">Выберите зал</option>
            {theaters.map((theater) => (
              <option key={theater.id} value={theater.id}>
                {theater.name}
              </option>
            ))}
          </select>
        </div>

        {/* Дата */}
        <div>
          <label className="block text-sm text-purple-300 mb-1">Дата</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
              text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
          />
        </div>

        {/* Время */}
        <div>
          <label className="block text-sm text-purple-300 mb-1">
            Время сеанса
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                  text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="Начало"
              />
            </div>
            <div>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                  text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="Конец"
              />
            </div>
          </div>
        </div>

        {/* Цена и места */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm text-purple-300 mb-1">Цена</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="0"
              className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-purple-300 mb-1">Места</label>
            <input
              type="number"
              value={formData.seatsAvailable}
              onChange={(e) =>
                setFormData({ ...formData, seatsAvailable: e.target.value })
              }
              placeholder="0"
              className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>
        </div>

        {/* Кнопка добавления */}
        <button
          onClick={handleSubmit}
          disabled={
            !formData.movieId ||
            !formData.theaterId ||
            !formData.date ||
            isLoading
          }
          className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
            font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
            transition-all duration-300 active:scale-95 hover:scale-[1.02]
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          <span>Добавить сеанс</span>
        </button>
      </div>
    </div>
  );
}
