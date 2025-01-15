import { useState } from 'react';
import { useShowTimes } from '../../../../hooks/useShowTimes';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TableControls } from '../../TableControls';
import { Pagination } from '../../Pagination';
import { ShowTime } from '../../../../types/showtime';
import { useBookings } from '../../../../hooks/useBookings';
import { AddShowTimeBookingForm } from './AddShowTimeBookingForm';
import { formatTime } from '../../../../utils/formatters';

export function ShowTimesBookingTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedShowTime, setExpandedShowTime] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'archive'>('current');
  const [dateFilter, setDateFilter] = useState('');

  const { useShowTimesWithBookings } = useShowTimes();
  const showTimesQuery = useShowTimesWithBookings();
  const { data: showTimes, isLoading, isError } = showTimesQuery;
  const { confirmBookingMutation, deleteBookingByIdMutation } = useBookings();

  if (isLoading) {
    return <div className="text-purple-200">Загрузка...</div>;
  }

  if (isError) {
    return <div className="text-red-400">Ошибка загрузки данных</div>;
  }

  const currentTime = new Date();

  const filteredShowTimes =
    showTimes?.filter((showTime: ShowTime) => {
      const isArchived = new Date(showTime.endTime) < currentTime;
      const matchesSearch =
        showTime.movie.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        showTime.theater.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDate = dateFilter
        ? format(new Date(showTime.startTime), 'yyyy-MM-dd') === dateFilter
        : true;

      return (
        matchesSearch &&
        matchesDate &&
        ((activeTab === 'current' && !isArchived) ||
          (activeTab === 'archive' && isArchived))
      );
    }) || [];

  const totalPages = Math.ceil(filteredShowTimes.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedShowTimes = filteredShowTimes.slice(
    start,
    start + itemsPerPage
  );

  // Обработчик успешного подтверждения
  const handleConfirm = (e: React.MouseEvent, bookingId: number) => {
    e.stopPropagation();
    confirmBookingMutation.mutate(bookingId, {
      onSuccess: () => {
        showTimesQuery.refetch();
      },
    });
  };

  const handleDelete = (e: React.MouseEvent, bookingId: number) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить эту бронь?')) {
      deleteBookingByIdMutation.mutate(
        { id: bookingId },
        {
          onSuccess: () => {
            showTimesQuery.refetch();
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <AddShowTimeBookingForm
        onSuccess={() => {
          showTimesQuery.refetch();
        }}
      />

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'current'
                ? 'bg-purple-600/80 text-white'
                : 'bg-purple-900/50 text-purple-300'
            }`}
          >
            Текущие сеансы
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'archive'
                ? 'bg-purple-600/80 text-white'
                : 'bg-purple-900/50 text-purple-300'
            }`}
          >
            Архив
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg
              text-purple-200 focus:outline-none focus:border-purple-500"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="p-2 bg-purple-900/50 rounded-lg text-purple-300
                hover:bg-purple-800/50 transition-colors"
            >
              Сбросить
            </button>
          )}
        </div>
      </div>

      <TableControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <div className="bg-purple-950/50 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">
                  Фильм
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">
                  Кинозал
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">
                  Дата и время
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">
                  Всего мест
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">
                  Забронировано
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">
                  Свободно
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">
                  Заполненность
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {paginatedShowTimes.map((showTime: ShowTime) => (
                <>
                  <tr
                    key={showTime.id}
                    className="hover:bg-purple-900/20 cursor-pointer"
                    onClick={() =>
                      setExpandedShowTime(
                        expandedShowTime === showTime.id ? null : showTime.id
                      )
                    }
                  >
                    <td className="px-6 py-4 text-purple-200">
                      {showTime.movie.title}
                    </td>
                    <td className="px-6 py-4 text-purple-200">
                      {showTime.theater.name}
                    </td>
                    <td className="px-6 py-4 text-purple-200">
                      {format(
                        new Date(showTime.startTime),
                        'dd MMMM yyyy',
                        {
                          locale: ru,
                        }
                      )} -
                      {formatTime(showTime.startTime.toString())}
                    </td>
                    <td className="px-6 py-4 text-purple-200">
                      {showTime.seatsAvailable}
                    </td>
                    <td className="px-6 py-4 text-purple-200">
                      {showTime.reservedSeatsCount}
                    </td>
                    <td className="px-6 py-4 text-purple-200">
                      {showTime.seatsAvailable -
                        (showTime.reservedSeatsCount || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-purple-900/30 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                            style={{
                              width: `${
                                ((showTime.reservedSeatsCount || 0) * 100) /
                                showTime.seatsAvailable
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-purple-200">
                          {Math.round(
                            ((showTime.reservedSeatsCount || 0) * 100) /
                              showTime.seatsAvailable
                          )}
                          %
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Раскрывающийся список бронирований */}
                  {expandedShowTime === showTime.id &&
                    showTime.bookings.length > 0 && (
                      <tr>
                        <td colSpan={7} className="bg-purple-900/30 px-6 py-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-purple-200 mb-3">
                              Список бронирований:
                            </h4>
                            <div className="grid gap-2">
                              {showTime.bookings.map((booking) => (
                                <div
                                  key={booking.id}
                                  className="flex items-center justify-between bg-purple-900/20
                                  rounded-lg p-3 text-sm text-purple-200"
                                >
                                  <div className="flex gap-6">
                                    <span>ID: {booking.id}</span>
                                    <span>Телефон: {booking.phone}</span>
                                    <span>Мест: {booking.reservedSeats}</span>
                                    <span>
                                      Ряд:{' '}
                                      {Array.from(new Set(booking.row)).join(
                                        ', '
                                      )}
                                    </span>
                                    <span>
                                      Места:{' '}
                                      {booking.seatPerRow.sort().join(', ')}
                                    </span>
                                    {booking.product && (
                                      <span>Подарок: {booking.product.name}</span>
                                    )}
                                    <span>Сумма: {booking.totalAmount} ₽</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs
                                      ${
                                        booking.confirmation
                                          ? 'bg-green-600/50 text-green-200'
                                          : 'bg-yellow-600/50 text-yellow-200'
                                      }`}
                                    >
                                      {booking.confirmation
                                        ? 'Подтверждено'
                                        : 'Ожидает'}
                                    </span>
                                    {!booking.confirmation && (
                                      <button
                                        onClick={(e) =>
                                          handleConfirm(e, booking.id)
                                        }
                                        disabled={
                                          confirmBookingMutation.isPending
                                        }
                                        className="px-3 py-1 bg-green-600/50 rounded-full text-xs
                                          text-green-200 hover:bg-green-600/70 transition-colors
                                          disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {confirmBookingMutation.isPending
                                          ? 'Подтверждение...'
                                          : 'Подтвердить'}
                                      </button>
                                    )}
                                    <button
                                      onClick={(e) =>
                                        handleDelete(e, booking.id)
                                      }
                                      disabled={
                                        deleteBookingByIdMutation.isPending
                                      }
                                      className="px-3 py-1 bg-red-600/50 rounded-full text-xs
                                        text-red-200 hover:bg-red-600/70 transition-colors
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {deleteBookingByIdMutation.isPending
                                        ? 'Удаление...'
                                        : 'Удалить'}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredShowTimes.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
