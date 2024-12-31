import { BookedPosterCard } from './BookedPosterCard';
import { useBookedPosters } from '../../hooks/useBookedPosters';

export function BookedPostersList() {
  // Используем хук для получения актуального списка броней
  const { bookedPosters } = useBookedPosters();

  if (bookedPosters.length === 0) {
    return (
      <div className="text-center py-12 text-purple-300">
        У вас пока нет забронированных билетов
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookedPosters.map((poster) => (
        <BookedPosterCard key={poster.id} {...poster} />
      ))}
    </div>
  );
}