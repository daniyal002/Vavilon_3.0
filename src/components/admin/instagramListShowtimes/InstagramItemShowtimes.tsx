import { IMovieCard } from "../../../types/showtime";
import { baseURL } from "../../../api/axios";
import { formatTime } from "../../../utils/formatters";

type MovieCardProps = IMovieCard;

export function InstagramItemShowtimes(showTime: MovieCardProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 pr-2 bg-white rounded-lg shadow-md ">
    <div className="flex-shrink-0 w-36 h-36">
      <img
        src={`${baseURL}/${showTime.movie.imagePath}`}
        alt={showTime.movie.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <h2 className="text-lg font-bold text-gray-900">{showTime.movie.title}</h2>
      <div className="flex items-center gap-1">
      <p className="text-sm text-gray-600">{showTime.movie.year}</p>
      {showTime.movie.genres?.map((genre, index) => (
              <span key={genre.name} className="text-sm">
                {index > 0 && " / "}
                {genre.name}
              </span>
            ))}
            </div>
    </div>
    <div className="flex-shrink-0 text-center px-4">
      <p className="text-yellow-500 text-xl">★ <span className="text-green-500">{showTime.movie.rating}</span></p>
      <p className="text-lg font-semibold text-gray-900">{showTime.price}₽</p>
    </div>
    <div className=" bg-purple-700 rounded-lg">
      <div className="px-3 py-2 rounded-md text-center flex items-center justify-center">

      <p className="text-white font-bold pb-5">
      {formatTime(showTime.startTime.toString())}
      </p>
      </div>
    </div>
  </div>

  );
}
