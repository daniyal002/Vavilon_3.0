import { useState, useCallback } from 'react';
import { Movie } from '../types/movie';

export function useMovieNavigation(movies: Movie[]) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextMovie = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const previousMovie = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  }, [movies.length]);

  return {
    currentMovie: movies[currentIndex],
    currentIndex,
    nextMovie,
    previousMovie,
    isFirst: currentIndex === 0,
    isLast: currentIndex === movies.length - 1,
  };
}