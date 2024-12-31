interface MovieGenresProps {
  genres: string[];
}

export function MovieGenres({ genres }: MovieGenresProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
      {genres.map((genre) => (
        <span
          key={genre}
          className="px-2 md:px-3 py-1 rounded-full text-xs font-semibold bg-purple-800/50 text-purple-200 border border-purple-700/50 backdrop-blur-sm"
        >
          {genre}
        </span>
      ))}
    </div>
  );
}