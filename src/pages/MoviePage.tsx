import { useParams, useNavigate } from 'react-router-dom';
import { useMovies } from '../hooks/useMovies';
import { MovieDetails } from '../components/MovieDetails';

export function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useMovie } = useMovies();
  const { data: movie, isLoading, isError } = useMovie(Number(id));

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="text-purple-200">Загрузка...</div>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="text-red-400">Ошибка загрузки фильма</div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-purple-600/80 rounded-lg font-semibold
            text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50
            transition-all duration-300 active:scale-95 hover:scale-[1.02]"
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <MovieDetails movie={movie} />
    </div>
  );
}
