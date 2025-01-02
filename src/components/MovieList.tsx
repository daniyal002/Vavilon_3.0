import { useShowTimes } from '../hooks/useShowTimes';
import { MovieCard } from './MovieCard';

export function MovieList() {
  const { showTimesQuery } = useShowTimes();

  if (showTimesQuery.isLoading) {
    return <div className="text-purple-200">Загрузка...</div>;
  }

  if (showTimesQuery.isError) {
    return <div className="text-red-400">Ошибка загрузки данных</div>;
  }

  if (!showTimesQuery.data || showTimesQuery.data.length === 0) {
    return <div className="text-purple-200">Нет доступных сеансов</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {showTimesQuery.data.map((showTime) => (
        <MovieCard key={showTime.id} {...showTime} />
      ))}
    </div>
  );
}
