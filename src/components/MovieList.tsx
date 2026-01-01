import { format, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useShowTimes } from "../hooks/useShowTimes";
import { MovieCard } from "./MovieCard";
import { ShowTime } from "../types/showtime";
import { Clapperboard } from "lucide-react";

export function MovieList() {
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const { showTimesQuery } = useShowTimes();

  useEffect(() => {
    if (showTimesQuery.data && showTimesQuery.data.showTimes.length > 0) {
      setSelectedTheater(
        showTimesQuery.data.showTimes[0].theater.id.toString()
      );
    }
  }, [showTimesQuery.data]);

  if (showTimesQuery.isLoading) {
    return <div className="text-purple-200">Загрузка...</div>;
  }

  if (showTimesQuery.isError) {
    return <div className="text-red-400">Ошибка загрузки данных</div>;
  }

  if (
    showTimesQuery.data?.showTimes &&
    showTimesQuery.data?.showTimes.length < 1
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 w-full animate-in fade-in zoom-in duration-500">
        {/* Декоративное свечение на фоне */}
        <div className="absolute w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full -z-10" />

        {/* Иконка в красивом круге */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
          <div className="relative bg-purple-900/40 p-6 rounded-full border border-purple-500/30 shadow-2xl">
            <Clapperboard size={48} className="text-purple-400 opacity-80" />
          </div>
        </div>

        {/* Текстовый блок */}
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight text-center">
          На этот день пока пусто
        </h3>
        <p className="text-purple-300/60 max-w-[280px] text-center text-sm leading-relaxed">
          Все фильмы на выбранную дату уже прошли или ещё не запланированы.
          Попробуйте заглянуть попозже!
        </p>

        {/* Декоративная линия */}
        <div className="mt-8 w-12 h-1 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent rounded-full"/>
      </div>
    );
  }

  const currentDate = new Date();

  // Фильтруем сеансы, которые еще не закончились
  const activeShowTimes = (showTimesQuery.data?.showTimes || []).filter(
    (showTime) => new Date(showTime.endTime) > currentDate
  );

  // Получаем дату показа с учетом правила 5 утра
  const getShowDate = (showTime: ShowTime) => {
    const startTime = new Date(showTime.startTime);
    const showDate = new Date(showTime.date);
    const fiveAM = new Date(showDate);
    fiveAM.setHours(5, 0, 0, 0);

    return startTime.toLocaleDateString("ru-Ru", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    }) <
      fiveAM.toLocaleDateString("ru-Ru", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
      })
      ? format(addDays(showDate, -1), "yyyy-MM-dd")
      : format(showDate, "yyyy-MM-dd");
  };

  const filteredShowTimes = activeShowTimes
    .filter((showTime) => {
      const theaterMatch =
        selectedTheater === "all" ||
        showTime.theater.id.toString() === selectedTheater;
      const showTimeDate = getShowDate(showTime);
      return theaterMatch && showTimeDate === selectedDate;
    })
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  // Получаем уникальные залы
  const uniqueTheaters = Array.from(
    new Map(
      showTimesQuery.data?.showTimes.map((st) => [st.theater.id, st.theater])
    ).values()
  );

  // Получаем уникальные даты из активных сеансов с учетом правила 5 утра
  const uniqueDates = Array.from(
    new Set(activeShowTimes.map((st) => getShowDate(st)))
  ).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 mb-10">
        {/* Фильтр по залам */}
        {selectedTheater && (
          <div className="w-full overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {uniqueTheaters.map((theater) => (
                <button
                  key={theater.id}
                  onClick={() => setSelectedTheater(theater.id.toString())}
                  className={`px-4 py-3 rounded-lg whitespace-nowrap min-w-[100px]
                    ${
                      selectedTheater === theater.id.toString()
                        ? "bg-purple-600 text-white"
                        : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"
                    }`}
                >
                  {theater.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Фильтр по датам */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {uniqueDates.map((date) => {
              const isToday = format(new Date(), "yyyy-MM-dd") === date;
              const isTomorrow =
                format(addDays(new Date(), 1), "yyyy-MM-dd") === date;

              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-4 py-3 rounded-lg whitespace-nowrap min-w-[100px]
                    ${
                      selectedDate === date
                        ? "bg-purple-600/80 text-white"
                        : "bg-purple-900/50 text-purple-300"
                    }`}
                >
                  {isToday
                    ? "Сегодня"
                    : isTomorrow
                    ? "Завтра"
                    : format(new Date(date), "d MMM", { locale: ru })}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Toaster />
        {filteredShowTimes.map((showTime) => (
          <MovieCard
            key={showTime.id}
            {...showTime}
            ENABLE_PROMOCODE={showTimesQuery.data?.ENABLE_PROMOCODE as boolean}
          />
        ))}
      </div>
    </div>
  );
}
