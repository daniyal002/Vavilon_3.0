import { useState, useEffect, MouseEvent, TouchEvent, useMemo } from 'react';
import MovieSelect from '../../UI/MovieSelect';
import ContextMenu from '../../UI/ContextMenu';
import { ShowTime } from '../../../types/showtime';
import { format,parse } from 'date-fns';
import { useShowTimes } from '../../../hooks/useShowTimes';
import { useMovies } from '../../../hooks/useMovies';
import { useTheaters } from '../../../hooks/useTheaters';
import { AddShowTimeForm } from './AddShowTimeForm';
import { TableControls } from '../TableControls';
import { Pagination } from '../Pagination';
// Импортируйте другие необходимые хуки и компоненты

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

  // Состояние для контекстного меню
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    showTime: ShowTime | null;
  }>({ visible: false, x: 0, y: 0, showTime: null });

  // Функция для открытия контекстного меню
  const handleContextMenu = (event: MouseEvent | TouchEvent, showTime: ShowTime) => {
    event.preventDefault();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const rootW = 150; // minWidth контекстного меню
    const rootH = 150; // примерная высота контекстного меню

    const right = screenW - clientX > rootW;
    const left = !right;
    const top = screenH - clientY > rootH;
    const bottom = !top;

    const menuX = right ? clientX : clientX - rootW;
    const menuY = top ? clientY : clientY - rootH;

    setContextMenu({
      visible: true,
      x: menuX,
      y: menuY,
      showTime: showTime,
    });
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
      startTime: format(new Date(showTime.startTime), 'HH:mm'), // Преобразуем Date в строку
      endTime: format(new Date(showTime.endTime), 'HH:mm'),     // Преобразуем Date в строку
      price: showTime.price.toString(),
      date: format(new Date(showTime.date), 'yyyy-MM-dd'),     // Преобразуем Date в строку в нужном формате
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
      console.log(editingData)
      // Предполагается, что updateShowTimeMutation принимает объект с необходимыми полями
      updateShowTimeMutation.mutate({
        id: editingId,
        movieId: Number(editingData.movieId),
        theaterId: Number(editingData.theaterId),
        startTime: editingData.startTime, // Преобразуем Date в строку
        endTime: editingData.endTime,     // Преобразуем Date в строку
        price: Number(editingData.price),
        date: format(new Date(editingData.date), 'yyyy-MM-dd'),
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

  // Закрытие контекстного меню при клике вне его
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        handleCloseContextMenu();
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleClick);
    };
  }, [contextMenu.visible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && contextMenu.visible) {
        handleCloseContextMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu.visible]);

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
                {/* Удаляем колонку "Действия" */}
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {filteredAndPaginatedData.showTimes.map((showTime) => (
                <tr
                  key={showTime.id}
                  className="hover:bg-purple-900/20 transition-colors"
                  onContextMenu={(e) => handleContextMenu(e, showTime)}
                  onTouchStart={(e) => {
                    const touchDuration = 500;
                    let touchTimer: number;
                    const handleTouchEnd = () => {
                      clearTimeout(touchTimer);
                      tr.removeEventListener('touchend', handleTouchEnd);
                    };
                    const tr = e.currentTarget;
                    tr.addEventListener('touchend', handleTouchEnd);
                    touchTimer = setTimeout(() => handleContextMenu(e as any, showTime), touchDuration);
                  }}
                >
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === showTime.id ? (
                      <MovieSelect
                        movies={moviesQuery.data || []}
                        selectedMovieId={editingData.movieId}
                        onChange={(movieId) => setEditingData({ ...editingData, movieId })}
                        isLabel={false}
                      />
                    ) : (
                      <span className="text-purple-200 text-sm">{showTime.movie.title}</span>
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
                      <span className="text-purple-200 text-sm">{showTime.theater.name}</span>
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
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onEdit={() => handleEdit(contextMenu.showTime!)}
          onDelete={() => handleDelete(contextMenu.showTime!.id)}
          onCopy={() => handleCopy(contextMenu.showTime!)}
          onSave={editingId === contextMenu.showTime.id ? handleSave : undefined}
          onCancel={editingId === contextMenu.showTime.id ? handleCancel : undefined}
          onClose={handleCloseContextMenu}
          isEditing={editingId === contextMenu.showTime.id}
        />
      )}

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

export default ShowTimesTable;