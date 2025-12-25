import { useState, useMemo, useEffect } from 'react';
import { useBookings } from '../../../hooks/useBookings';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Pagination } from '../Pagination';

// --- Основной компонент таблицы ---
export function BookingSummariesTable() {
  const { useBookingSummariesByPhone } = useBookings();
  const { data: summaries, isLoading, isError, error } = useBookingSummariesByPhone();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Состояние пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Сброс страницы при поиске
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortConfig]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    if (!summaries) return [];

    let result = [...summaries];

    // 1. Поиск
    if (searchQuery) {
      result = result.filter(summary =>
        summary.phone.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Сортировка
    if (sortConfig) {
      result.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [summaries, searchQuery, sortConfig]);

  // 3. Пагинация (срез данных)
  const paginatedSummaries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  if (isLoading) return <div className="p-6 text-purple-200">Загрузка данных...</div>;
  if (isError) return <div className="p-6 text-red-500">Ошибка: {(error as Error).message}</div>;

  // Хелпер для отрисовки иконки сортировки
  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown size={14} className="ml-1 opacity-30" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUp size={14} className="ml-1 text-purple-400" />
      : <ArrowDown size={14} className="ml-1 text-purple-400" />;
  };

  return (
    <div className="bg-purple-950/50 rounded-xl p-6 shadow-lg border border-purple-800/30">
      <h2 className="text-2xl font-bold text-purple-100 mb-6">Сводка бронирований по телефону</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск по номеру телефона..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md p-3 bg-purple-900/40 border border-purple-700/50 rounded-xl text-purple-100 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        />
      </div>

      <div className="bg-purple-900/20 rounded-xl border border-purple-700/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-purple-700/50">
            <thead className="bg-purple-900/40">
              <tr>
                {[
                  { key: 'phone', label: 'Телефон' },
                  { key: 'bookingCount', label: 'Бронирований' },
                  { key: 'totalAmount', label: 'Общая сумма' },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:bg-purple-800/30 transition-colors"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center">
                      {col.label}
                      <SortIcon columnKey={col.key} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {paginatedSummaries.length > 0 ? (
                paginatedSummaries.map((summary) => (
                  <tr key={summary.phone} className="hover:bg-purple-800/10 transition-colors">
                    <td className="px-6 py-4 text-purple-100 font-medium">{summary.phone}</td>
                    <td className="px-6 py-4 text-purple-200">{summary.bookingCount}</td>
                    <td className="px-6 py-4 text-purple-200">
                      {summary.totalAmount.toLocaleString()} ₽
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-purple-400">
                    Ничего не найдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredAndSortedData.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}

export default BookingSummariesTable;