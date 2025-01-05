import { useState, useMemo } from 'react';
import { useShowTimes } from '../../../hooks/useShowTimes';
import { TableControls } from '../TableControls';
import { Pagination } from '../Pagination';
import { Pencil, Trash2, Save, X, Copy } from 'lucide-react';
import { useMovies } from '../../../hooks/useMovies';
import { useTheaters } from '../../../hooks/useTheaters';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AddShowTimeForm } from './AddShowTimeForm';
import { ShowTime } from '../../../types/showtime';

type ShowTimeCopy = Pick<
  ShowTime,
  | 'movieId'
  | 'theaterId'
  | 'startTime'
  | 'endTime'
  | 'price'
  | 'date'
  | 'seatsAvailable'
>;

export function ShowTimesTable() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({
    movieId: '',
    theaterId: '',
    startTime: '',
    endTime: '',
    price: '',
    date: '',
    seatsAvailable: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    showTimesQuery,
    createShowTimeMutation,
    updateShowTimeMutation,
    deleteShowTimeMutation,
  } = useShowTimes();

  const { useMoviesQuery } = useMovies();
  const moviesQuery = useMoviesQuery();

  const { theatersQuery } = useTheaters();

  const [copyData, setCopyData] = useState<ShowTimeCopy | null>(null);

  const filteredAndPaginatedData = useMemo(() => {
    if (!showTimesQuery.data)
      return { showTimes: [], totalPages: 0, totalItems: 0 };

    const filtered = showTimesQuery.data.filter(
      (showTime) =>
        showTime.movie.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        showTime.theater.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const showTimes = filtered.slice(start, start + itemsPerPage);

    return { showTimes, totalPages, totalItems: filtered.length };
  }, [showTimesQuery.data, searchQuery, currentPage, itemsPerPage]);

  const handleEdit = (showTime: any) => {
    setEditingId(showTime.id);
    setEditingData({
      movieId: showTime.movieId.toString(),
      theaterId: showTime.theaterId.toString(),
      startTime: format(new Date(showTime.startTime), 'HH:mm'),
      endTime: format(new Date(showTime.endTime), 'HH:mm'),
      price: showTime.price.toString(),
      date: format(new Date(showTime.date), 'yyyy-MM-dd'),
      seatsAvailable: showTime.seatsAvailable.toString(),
    });
  };

  const handleUpdate = (showTimeId: number) => {
    updateShowTimeMutation.mutate({
      id: showTimeId,
      ...editingData,
      movieId: parseInt(editingData.movieId),
      theaterId: parseInt(editingData.theaterId),
      price: parseFloat(editingData.price),
      seatsAvailable: parseInt(editingData.seatsAvailable),
    });
    setEditingId(null);
  };

  const handleCopy = (showTime: any) => {
    setCopyData({
      movieId: showTime.movieId,
      theaterId: showTime.theaterId,
      startTime: showTime.startTime,
      endTime: showTime.endTime,
      price: showTime.price,
      date: showTime.date,
      seatsAvailable: showTime.seatsAvailable,
    });
  };

  if (showTimesQuery.isLoading) {
    return <div className="text-purple-200">Загрузка...</div>;
  }

  if (showTimesQuery.isError) {
    return <div className="text-red-400">Ошибка загрузки данных</div>;
  }

  return (
    <div className="space-y-6">
      <AddShowTimeForm
        onAdd={createShowTimeMutation.mutate}
        isLoading={createShowTimeMutation.isPending}
        movies={moviesQuery.data || []}
        theaters={theatersQuery.data || []}
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
                  Фильм
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Зал
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Дата
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Время
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Цена
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Места
                </th>
                <th className="px-3 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-purple-200">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {filteredAndPaginatedData.showTimes.map((showTime) => (
                <tr
                  key={showTime.id}
                  className="hover:bg-purple-900/20 transition-colors"
                >
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === showTime.id ? (
                      <select
                        value={editingData.movieId}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            movieId: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      >
                        {moviesQuery.data?.map((movie) => (
                          <option key={movie.id} value={movie.id}>
                            {movie.title}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {showTime.movie.title}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === showTime.id ? (
                      <select
                        value={editingData.theaterId}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            theaterId: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      >
                        {theatersQuery.data?.map((theater) => (
                          <option key={theater.id} value={theater.id}>
                            {theater.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {showTime.theater.name}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === showTime.id ? (
                      <input
                        type="date"
                        value={editingData.date}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            date: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {format(new Date(showTime.date), 'dd.MM.yyyy')}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === showTime.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="time"
                          value={editingData.startTime}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              startTime: e.target.value,
                            })
                          }
                          className="w-24 p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                            text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                        />
                        <span className="text-purple-200">-</span>
                        <input
                          type="time"
                          value={editingData.endTime}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              endTime: e.target.value,
                            })
                          }
                          className="w-24 p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                            text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                        />
                      </div>
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {format(new Date(showTime.startTime), 'HH:mm')} -{' '}
                        {format(new Date(showTime.endTime), 'HH:mm')}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === showTime.id ? (
                      <input
                        type="number"
                        value={editingData.price}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            price: e.target.value,
                          })
                        }
                        className="w-24 p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {showTime.price}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === showTime.id ? (
                      <input
                        type="number"
                        value={editingData.seatsAvailable}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            seatsAvailable: e.target.value,
                          })
                        }
                        className="w-24 p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {showTime.seatsAvailable}
                      </span>
                    )}
                  </td>

                  <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                    <div className="flex justify-end gap-1 md:gap-2">
                      {editingId === showTime.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(showTime.id)}
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
                            onClick={() => handleEdit(showTime)}
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
                                  'Вы уверены, что хотите удалить этот сеанс?'
                                )
                              ) {
                                deleteShowTimeMutation.mutate(showTime.id);
                              }
                            }}
                            className="p-1.5 md:p-2 bg-red-600/80 rounded-lg text-white 
                              hover:bg-red-500 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            <span className="hidden md:inline">Удалить</span>
                          </button>
                          <button
                            onClick={() => handleCopy(showTime)}
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

      {(createShowTimeMutation.isPending ||
        updateShowTimeMutation.isPending ||
        deleteShowTimeMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-purple-900/90 text-purple-200 px-4 py-2 rounded-lg shadow-lg">
          Сохранение изменений...
        </div>
      )}
    </div>
  );
}
