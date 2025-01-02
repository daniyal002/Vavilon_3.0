import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGenres } from '../../../hooks/useGenres';

interface AddMovieFormProps {
  onAdd: (movieData: {
    title: string;
    description: string;
    rating: number;
    year: number;
    ageRestriction: string;
    trailerLink: string;
    premiere: boolean;
    genreIds: number[];
    image?: File;
  }) => void;
  isLoading: boolean;
}

export function AddMovieForm({ onAdd, isLoading }: AddMovieFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
    year: new Date().getFullYear().toString(),
    ageRestriction: '',
    trailerLink: '',
    premiere: false,
    genreIds: [] as number[],
  });
  const [image, setImage] = useState<File | null>(null);
  const { genresQuery } = useGenres();

  const handleSubmit = () => {
    if (formData.title.trim()) {
      onAdd({
        ...formData,
        rating: parseFloat(formData.rating) || 0,
        year: parseInt(formData.year),
        image: image || undefined,
      });
      setFormData({
        title: '',
        description: '',
        rating: '',
        year: new Date().getFullYear().toString(),
        ageRestriction: '',
        trailerLink: '',
        premiere: false,
        genreIds: [],
      });
      setImage(null);
    }
  };

  return (
    <div className="bg-purple-950/50 rounded-xl p-4 md:p-6 shadow-lg">
      <h3 className="text-base md:text-lg font-semibold text-purple-200 mb-3 md:mb-4">
        Добавить новый фильм
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Название фильма"
          className="w-full p-2.5 md:p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500"
        />
        <input
          type="number"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          placeholder="Рейтинг"
          step="0.1"
          min="0"
          max="10"
          className="w-full p-2.5 md:p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500"
        />
        <input
          type="number"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          placeholder="Год выпуска"
          className="w-full p-2.5 md:p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500"
        />
        <input
          type="text"
          value={formData.ageRestriction}
          onChange={(e) =>
            setFormData({ ...formData, ageRestriction: e.target.value })
          }
          placeholder="Возрастное ограничение"
          className="w-full p-2.5 md:p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500"
        />
        <input
          type="text"
          value={formData.trailerLink}
          onChange={(e) =>
            setFormData({ ...formData, trailerLink: e.target.value })
          }
          placeholder="Ссылка на трейлер"
          className="w-full p-2.5 md:p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.premiere}
            onChange={(e) =>
              setFormData({ ...formData, premiere: e.target.checked })
            }
            className="w-4 h-4 bg-purple-900/50 border border-purple-700/30 rounded 
              text-purple-600 focus:ring-purple-500"
          />
          <span className="text-purple-200">Премьера</span>
        </div>
        <select
          multiple
          value={formData.genreIds.map(String)}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, (option) =>
              parseInt(option.value)
            );
            setFormData({ ...formData, genreIds: values });
          }}
          className="w-full p-2.5 md:p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 focus:outline-none focus:border-purple-500"
        >
          {genresQuery.data?.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          accept="image/*"
          className="w-full p-2.5 md:p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
            file:text-sm file:font-semibold file:bg-purple-600 file:text-white
            hover:file:bg-purple-500"
        />
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Описание фильма"
          className="w-full p-2.5 md:p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500
            col-span-2 resize-none h-32"
        />
        <button
          onClick={handleSubmit}
          disabled={!formData.title.trim() || isLoading}
          className="col-span-2 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
            font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
            transition-all duration-300 active:scale-95 hover:scale-[1.02]
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus size={18} className="md:w-5 md:h-5" />
          <span>Добавить фильм</span>
        </button>
      </div>
    </div>
  );
}
