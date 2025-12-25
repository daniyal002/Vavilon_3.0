import { format, addDays, startOfDay, addHours } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState, useMemo } from 'react';
import { useShowTimes } from '../../../hooks/useShowTimes';
import { InstagramCanvasAfisha } from './InstagramCanvasAfisha';

export function InstagramListShowtimes() {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const { showTimesQuery } = useShowTimes();

  const filteredShowTimes = useMemo(() => {
    const allSessions = showTimesQuery.data?.showTimes || [];

    // Определяем границы "кинодня" (от 05:00 выбранного дня до 05:00 следующего)
    const dayStart = addHours(startOfDay(new Date(selectedDate)), 5);
    const dayEnd = addHours(dayStart, 24);

    return allSessions
      .filter(st => {
        const sessionTime = new Date(st.startTime);
        return sessionTime >= dayStart && sessionTime < dayEnd;
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [showTimesQuery.data, selectedDate]);

  if (showTimesQuery.isLoading) return <div className="text-purple-200">Загрузка...</div>;

  return (
    <div className="p-4 flex flex-col items-center w-full">
      <div className="flex gap-2 mb-8 overflow-x-auto w-full max-w-2xl pb-2">
        {/* Кнопки дат (можно оставить как были) */}
        {[0, 1, 2, 3, 4].map(offset => {
          const date = format(addDays(new Date(), offset), 'yyyy-MM-dd');
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap ${
                selectedDate === date ? 'bg-purple-600 text-white' : 'bg-purple-900/40 text-purple-300'
              }`}
            >
              {format(new Date(date), 'd MMM', { locale: ru })}
            </button>
          );
        })}
      </div>

      {filteredShowTimes.length > 0 ? (
        <InstagramCanvasAfisha showTimes={filteredShowTimes} selectedDate={selectedDate} />
      ) : (
        <div className="text-purple-400">Сеансов не найдено</div>
      )}
    </div>
  );
}