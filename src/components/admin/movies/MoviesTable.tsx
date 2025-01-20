import { useState, useMemo } from 'react';
import { useMovies } from '../../../hooks/useMovies';
import { AddMovieForm } from './AddMovieForm';
import { TableControls } from '../TableControls';
import { Pagination } from '../Pagination';
import { Pencil, Trash2, Save, X, Copy } from 'lucide-react';
import { useGenres } from '../../../hooks/useGenres';
import { baseURL } from '../../../api/axios';
import { Movie } from '../../../types/movie';

export function MoviesTable() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({
    title: '',
    description: '',
    rating: '',
    year: '',
    ageRestriction: '',
    trailerLink: '',
    premiere: false,
    genreIds: [] as number[],
    image: null as File | null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [copyData, setCopyData] = useState<Movie | null>(null);

  const {
    useMoviesQuery,
    createMovieMutation,
    updateMovieMutation,
    deleteMovieMutation,
  } = useMovies();

  const moviesQuery = useMoviesQuery();

  const { genresQuery } = useGenres();

  const filteredAndPaginatedData = useMemo(() => {
    if (!moviesQuery.data) return { movies: [], totalPages: 0, totalItems: 0 };

    const filtered = moviesQuery.data.filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const movies = filtered.slice(start, start + itemsPerPage);

    return { movies, totalPages, totalItems: filtered.length };
  }, [moviesQuery.data, searchQuery, currentPage, itemsPerPage]);

  const handleEdit = (movie: any) => {
    setEditingId(movie.id);
    setEditingData({
      title: movie.title,
      description: movie.description,
      rating: movie.rating.toString(),
      year: movie.year.toString(),
      ageRestriction: movie.ageRestriction,
      trailerLink: movie.trailerLink,
      premiere: movie.premiere,
      genreIds: movie.genres.map((g: any) => g.id),
      image: null,
    });
  };

  const handleUpdate = (movieId: number) => {
    if (editingData.title.trim()) {
      updateMovieMutation.mutate({
        id: movieId,
        ...editingData,
        rating: parseFloat(editingData.rating),
        year: parseInt(editingData.year),
        image: editingData.image || undefined,
      });
      setEditingId(null);
    }
  };

  const handleCopy = (movie: any) => {
    setCopyData({
      title: movie.title,
      description: movie.description,
      rating: movie.rating,
      year: movie.year,
      ageRestriction: movie.ageRestriction,
      trailerLink: movie.trailerLink,
      premiere: movie.premiere,
      genreIds: movie.genres.map((g: any) => g.id),
      image: undefined,
    });
  };

  if (moviesQuery.isLoading) {
    return <div className="text-purple-200">Загрузка...</div>;
  }

  if (moviesQuery.isError) {
    return <div className="text-red-400">Ошибка загрузки данных</div>;
  }

  return (
    <div className="space-y-6">
      <AddMovieForm
        onAdd={createMovieMutation.mutate}
        isLoading={createMovieMutation.isPending}
        initialData={copyData}
        onCopyComplete={() => setCopyData(null)}
      />

      <TableControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
      />

      <div className="bg-purple-950/50 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1024px]">
            <thead>
              <tr className="bg-purple-900/50">
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Постер
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Название
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Описание
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Рейтинг
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Год
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Возраст
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Премьера
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Жанры
                </th>
                <th className="px-3 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-purple-200">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {filteredAndPaginatedData.movies.map((movie) => (
                <tr
                  key={movie.id}
                  className="hover:bg-purple-900/20 transition-colors"
                >
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="w-16 h-24 relative group">
                      <img
                        src={`${baseURL}/${movie.imagePath}`}
                        alt={movie.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {editingId === movie.id && (
                        <div
                          className="absolute inset-0 flex items-center justify-center
                          bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                        >
                          <label className="cursor-pointer w-full h-full flex items-center justify-center">
                            <input
                              type="file"
                              onChange={(e) =>
                                setEditingData({
                                  ...editingData,
                                  image: e.target.files?.[0] || null,
                                })
                              }
                              accept="image/*"
                              className="hidden"
                            />
                            <span className="text-white text-xs text-center px-2">
                              Нажмите для изменения
                            </span>
                          </label>
                        </div>
                      )}
                      {editingId === movie.id && editingData.image && (
                        <div className="absolute inset-0">
                          <img
                            src={URL.createObjectURL(editingData.image)}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === movie.id ? (
                      <input
                        type="text"
                        value={editingData.title}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            title: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {movie.title}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === movie.id ? (
                      <div className="relative group">
                        <textarea
                          value={editingData.description}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              description: e.target.value,
                            })
                          }
                          rows={4}
                          className="w-full p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg
                            text-purple-200 focus:outline-none focus:border-purple-500 text-sm
                            scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-purple-900/30
                            hover:scrollbar-thumb-purple-500 hover:bg-purple-900/70 transition-colors"
                          placeholder="Введите описание фильма..."
                        />
                        <div
                          className="absolute bottom-2 right-3 text-xs text-purple-400/80
                          bg-purple-950/80 px-2 py-0.5 rounded-md"
                        >
                          {editingData.description.length}
                        </div>
                      </div>
                    ) : (
                      <div className="group relative max-w-md">
                        <div
                          className="text-purple-200 text-sm line-clamp-2 group-hover:line-clamp-none
                          transition-all duration-200"
                        >
                          {movie.description}
                        </div>
                        <div
                          className="absolute bottom-0 right-0 text-xs text-purple-400/80
                          bg-purple-950/80 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100
                          transition-opacity"
                        >
                          {movie.description.length}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === movie.id ? (
                      <input
                        type="number"
                        value={editingData.rating}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            rating: e.target.value,
                          })
                        }
                        step="0.1"
                        min="0"
                        max="10"
                        className="w-24 p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {movie.rating}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === movie.id ? (
                      <input
                        type="number"
                        value={editingData.year}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            year: e.target.value,
                          })
                        }
                        className="w-24 p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {movie.year}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === movie.id ? (
                      <input
                        type="checkbox"
                        checked={editingData.premiere}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            premiere: e.target.checked,
                          })
                        }
                        className="w-24 p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {movie.premiere ? "Да" : "Нет"}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === movie.id ? (
                      <input
                        type="text"
                        value={editingData.ageRestriction}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            ageRestriction: e.target.value,
                          })
                        }
                        className="w-24 p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {movie.ageRestriction}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === movie.id ? (
                      <div
                        className="max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600
                        scrollbar-track-purple-900/30 hover:scrollbar-thumb-purple-500"
                      >
                        <div className="flex flex-wrap gap-1.5 p-2 bg-purple-900/30 rounded-lg">
                          {genresQuery.data?.map((genre) => (
                            <label
                              key={genre.id}
                              className={`px-2 py-1 rounded text-xs cursor-pointer select-none
                                transition-colors duration-200
                                ${
                                  editingData.genreIds.includes(genre.id)
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={editingData.genreIds.includes(
                                  genre.id
                                )}
                                onChange={(e) => {
                                  const newGenreIds = e.target.checked
                                    ? [...editingData.genreIds, genre.id]
                                    : editingData.genreIds.filter(
                                        (id) => id !== genre.id
                                      );
                                  setEditingData({
                                    ...editingData,
                                    genreIds: newGenreIds,
                                  });
                                }}
                                className="hidden"
                              />
                              {genre.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {movie.genres?.map((genre) => (
                          <span
                            key={genre.id}
                            className="px-2 py-1 bg-purple-900/50 rounded text-purple-200 text-xs"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                    <div className="flex justify-end gap-1 md:gap-2">
                      {editingId === movie.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(movie.id as number)}
                            className="p-1.5 md:p-2 bg-green-600/80 rounded-lg text-white
                              hover:bg-green-500 transition-colors flex items-center gap-1"
                          >
                            <Save size={16} />
                            <span className="hidden md:inline">Сохранить</span>
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 md:p-2 bg-gray-600/80 rounded-lg text-white
                              hover:bg-gray-500 transition-colors flex items-center gap-1"
                          >
                            <X size={16} />
                            <span className="hidden md:inline">Отмена</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(movie)}
                            className="p-1.5 md:p-2 bg-yellow-600/80 rounded-lg text-white
                              hover:bg-yellow-500 transition-colors flex items-center gap-1"
                          >
                            <Pencil size={16} />
                            <span className="hidden md:inline">Изменить</span>
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Вы уверены, что хотите удалить этот фильм?'
                                )
                              ) {
                                deleteMovieMutation.mutate(movie.id as number);
                              }
                            }}
                            className="p-1.5 md:p-2 bg-red-600/80 rounded-lg text-white
                              hover:bg-red-500 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            <span className="hidden md:inline">Удалить</span>
                          </button>
                          <button
                            onClick={() => handleCopy(movie)}
                            className="p-1.5 md:p-2 bg-blue-600/80 rounded-lg text-white
                              hover:bg-blue-500 transition-colors flex items-center gap-1"
                          >
                            <Copy size={16} />
                            <span className="hidden md:inline">Копировать</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={filteredAndPaginatedData.totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndPaginatedData.totalItems}
          onPageChange={setCurrentPage}
        />
      </div>

      {(createMovieMutation.isPending ||
        updateMovieMutation.isPending ||
        deleteMovieMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-purple-900/90 text-purple-200 px-4 py-2 rounded-lg shadow-lg">
          Сохранение изменений...
        </div>
      )}
    </div>
  );
}
