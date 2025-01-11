import { useState, useMemo } from 'react';
import { useBookings } from '../../../hooks/useBookings';

export function BookingSummariesTable() {
    const {useBookingSummariesByPhone} = useBookings()
  const { data: summaries, isLoading, isError, error } = useBookingSummariesByPhone();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredSummaries = useMemo(() => {
    if (!summaries) return [];

    let filtered = summaries;

    if (searchQuery) {
      filtered = filtered.filter(summary =>
        summary.phone.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortConfig !== null) {
      filtered = [...filtered].sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [summaries, searchQuery, sortConfig]);

  if (isLoading) {
    return <div className="text-purple-200">Загрузка данных...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Ошибка: {(error as Error).message}</div>;
  }

  return (
    <div className="bg-purple-950/50 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-purple-200 mb-4">Сводка бронирований по телефону</h2>

      {/* Поле поиска */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск по телефону..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-200 focus:outline-none focus:border-purple-500"
        />
      </div>
      <div className="bg-purple-950/50 rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
      <table className="min-w-full bg-purple-900/50 rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-purple-200">Телефон</th>
            <th className="px-4 py-2 text-left text-purple-200">Количество бронирований</th>
            <th
              className="px-4 py-2 text-left text-purple-200 cursor-pointer"
              onClick={() => handleSort('totalAmount')}
            >
              Общая сумма (₽)
              {sortConfig?.key === 'totalAmount' ? (
                sortConfig.direction === 'ascending' ? (
                  <span> ▲</span>
                ) : (
                  <span> ▼</span>
                )
              ) : null}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSummaries && filteredSummaries.length > 0 ? (
            filteredSummaries.map((summary) => (
              <tr key={summary.phone} className="border-t border-purple-700">
                <td className="px-4 py-2 text-purple-100">{summary.phone}</td>
                <td className="px-4 py-2 text-purple-100">{summary.bookingCount}</td>
                <td className="px-4 py-2 text-purple-100">
                  {summary.totalAmount.toLocaleString()} ₽
                </td>
               
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-2 text-center text-purple-300">
                Нет данных для отображения.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      </div>
    </div>
  );
}

export default BookingSummariesTable;