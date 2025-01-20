import {
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import MovieSelect from '../../UI/MovieSelect';
import ContextMenu from '../../UI/ContextMenu';
import { ShowTime } from '../../../types/showtime';
import { format } from 'date-fns';
import { useMovies } from '../../../hooks/useMovies';
import { useTheaters } from '../../../hooks/useTheaters';
import { useShowTimes } from '../../../hooks/useShowTimes';
import { AddShowTimeForm } from './AddShowTimeForm';
import { Pagination } from '../Pagination';
import { formatTime } from '../../../utils/formatters';

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
    showAllTimesQuery,
    createShowTimeMutation,
    updateShowTimeMutation,
    deleteShowTimeMutation,
  } = useShowTimes();

  const { useMoviesQuery } = useMovies();
  const moviesQuery = useMoviesQuery();

  const { theatersQuery } = useTheaters();

  const [copyData, setCopyData] = useState<ShowTimeCopy | null>(null);

  const { data: showAllTimes } = showAllTimesQuery();

  // Состояние для контекстного меню
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    showTime: ShowTime | null;
  }>({ visible: false, x: 0, y: 0, showTime: null });

  // Переменные для обработки двойного тапа
  let lastTap = 0;

  // Функция для открытия контекстного меню
  const handleContextMenu = (x: number, y: number, showTime: ShowTime) => {
    setContextMenu({
      visible: true,
      x,
      y,
      showTime,
    });
  };

  // Обработчик кликов (для двойного тапа на мобильных)
  const handleRowClick = (event: React.MouseEvent | React.TouchEvent, showTime: ShowTime) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      event.preventDefault();
      let clientX = 0;
      let clientY = 0;

      if ('touches' in event && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if ('clientX' in event) {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      handleContextMenu(clientX, clientY, showTime);
      lastTap = 0;
    } else {
      lastTap = currentTime;
    }
  };

  // Функция для закрытия контекстного меню
  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Обработчики действий контекстного меню
  const handleEdit = (showTime: ShowTime) => {
    setEditingId(showTime.id);
    setEditingData({
      movieId: showTime.movieId.toString(),
      theaterId: showTime.theaterId.toString(),
      startTime: formatTime(showTime.startTime.toString()),
      endTime: formatTime(showTime .endTime.toString()),
      price: showTime.price.toString(),
      date: format(new Date(showTime.date), 'yyyy-MM-dd'),
      seatsAvailable: showTime.seatsAvailable.toString(),
    });
  };

  const handleDelete = (showTimeId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот сеанс?')) {
      deleteShowTimeMutation.mutate(showTimeId);
    }
  };

  const handleCopy = (showTime: ShowTime) => {
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

  const handleSave = () => {
    if (editingId !== null) {
      updateShowTimeMutation.mutate({
        id: editingId,
        movieId: Number(editingData.movieId),
        theaterId: Number(editingData.theaterId),
        startTime: editingData.startTime,
        endTime: editingData.endTime,
        price: Number(editingData.price),
        date: editingData.date,
        seatsAvailable: Number(editingData.seatsAvailable),
      });
      setEditingId(null);
      setEditingData({
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

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({
      movieId: '',
      theaterId: '',
      startTime: '',
      endTime: '',
      price: '',
      date: '',
      seatsAvailable: '',
    });
  };
  const [showCurrent,setShowCurrent] = useState<boolean>(false)
  const filteredAndPaginatedData = useMemo(() => {
    const currentTime = new Date();
    const filtered = showAllTimes?.showTimes?.filter((showTime) => {
      const showStartTime = new Date(showTime.startTime);
      return showCurrent ? showStartTime >= currentTime : showStartTime < currentTime; // Фильтрация по актуальности
    }) || [];

    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return dateA - dateB || timeA - timeB; // Сортировка по дате и времени
    });

    const totalItems = sorted.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return { showTimes: paginated, totalPages, totalItems };
  }, [showAllTimes, currentPage, itemsPerPage,showCurrent]);

  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        handleCloseContextMenu();
      }
    };

    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [contextMenu.visible]);

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

      {/* Поиск */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/3 p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
        />
      </div>

      <div className="flex justify-start gap-4">
        <button
          onClick={() => {setShowCurrent(true);setCurrentPage(1)}}
          className={`px-4 py-2 ${showCurrent ? 'bg-purple-600/80 text-white' : 'bg-purple-900/50 text-purple-300'} px-4 py-2 rounded-lg`}
        >
          Актуальные сеансы
        </button>
        <button
          onClick={() => {setShowCurrent(false);setCurrentPage(1)}}
          className={`px-4 py-2 ${!showCurrent ? 'bg-purple-600/80 text-white' : 'bg-purple-900/50 text-purple-300'} px-4 py-2 rounded-lg`}
        >
          Неактуальные сеансы
        </button>
      </div>

      <div className="bg-purple-950/50 rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-purple-700/30">
            <thead>
              <tr className="bg-purple-900/50">
                <th className="px-3 py-4 text-left text-xs font-semibold text-purple-200">
                  Фильм
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-purple-200">
                  Зал
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-purple-200">
                  Дата
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-purple-200">
                  Время
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-purple-200">
                  Цена
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-purple-200">
                  Места
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {filteredAndPaginatedData.showTimes.map((showTime: ShowTime) => (
                <tr
                  key={showTime.id}
                  className="hover:bg-purple-900/20 transition-colors"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleContextMenu(e.clientX, e.clientY, showTime);
                  }}
                  onClick={(e) => handleRowClick(e, showTime)}
                >
                  <td className="px-3 py-4">
                    {editingId === showTime.id ? (
                      <MovieSelect
                        movies={moviesQuery.data || []}
                        selectedMovieId={editingData.movieId}
                        onChange={(movieId) =>
                          setEditingData({ ...editingData, movieId })
                        }
                        isLabel={false}
                      />
                    ) : (
                      <span className="text-purple-200 md:text-sm text-xs">
                        {showTime.movie.title}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4">
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
                      <span className="text-purple-200 md:text-sm text-xs">
                        {showTime.theater.name}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4">
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
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 md:text-sm text-xs">
                        {format(new Date(showTime.date), 'dd.MM.yyyy')}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    {editingId === showTime.id ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="time"
                          value={editingData.startTime}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              startTime: e.target.value,
                            })
                          }
                          className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                        />
                        <input
                          type="time"
                          value={editingData.endTime}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              endTime: e.target.value,
                            })
                          }
                          className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                        />
                      </div>
                    ) : (
                      <span className="text-purple-200 md:text-sm text-xs">
                        {formatTime(showTime.startTime.toString())} -
                        {formatTime(showTime.endTime.toString())}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4">
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
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 md:text-sm text-xs">
                        {showTime.price}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4">
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
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 md:text-sm text-xs">
                        {showTime.seatsAvailable}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Пагинация и другие элементы */}
        <Pagination
          currentPage={currentPage}
          totalPages={filteredAndPaginatedData.totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndPaginatedData.totalItems}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Контекстное меню */}
      {contextMenu.visible && contextMenu.showTime && (
        <div ref={contextMenuRef}>
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y - 130}
            onEdit={() => handleEdit(contextMenu.showTime!)}
            onDelete={() => handleDelete(contextMenu.showTime!.id)}
            onCopy={() => handleCopy(contextMenu.showTime!)}
            onSave={
              editingId === contextMenu.showTime.id ? handleSave : undefined
            }
            onCancel={
              editingId === contextMenu.showTime.id ? handleCancel : undefined
            }
            onClose={handleCloseContextMenu}
            isEditing={editingId === contextMenu.showTime.id}
          />
        </div>
      )}

      {(createShowTimeMutation.isPending ||
        updateShowTimeMutation.isPending ||
        deleteShowTimeMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-purple-900/90 text-purple-200 px-4 py-2 rounded-lg shadow-lg">
          Сохранение изменений...
        </div>
      )}

      {/* Кнопки "Сохранить" и "Отменить" для мобильной версии */}
      {editingId !== null && (
        <div className="fixed bottom-0 left-0 w-full bg-purple-900/80 p-4 flex justify-between items-center z-50">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-1/2 mr-2"
          >
            Сохранить
          </button>
          <button
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-1/2 ml-2"
          >
            Отменить
          </button>
        </div>
      )}
    </div>
  );
}

export default ShowTimesTable;