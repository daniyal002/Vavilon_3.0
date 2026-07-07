import { format, addDays, startOfDay, addHours } from "date-fns";
import { ru } from "date-fns/locale";
import { useState, useMemo, useEffect } from "react";
import { useShowTimes } from "../../../hooks/useShowTimes";
import { InstagramCanvasAfisha } from "./InstagramCanvasAfisha";
import { TheaterShowTimes } from "../../../types/showtime";

export function InstagramListShowtimes() {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const { showTimesQuery } = useShowTimes();

  const { refetch } = showTimesQuery;
  const [selectedTheaterId, setSelectedTheaterId] = useState<number | null>(
    null,
  );

  const groupedShowTimes = useMemo(() => {
    const allSessions = showTimesQuery.data?.showTimes || [];

    // Определяем границы "кинодня" (от 05:00 выбранного дня до 05:00 следующего)
    const dayStart = addHours(startOfDay(new Date(selectedDate)), 8);
    const dayEnd = addHours(dayStart, 24);

    const filtered = allSessions
      .filter((st) => {
        const sessionTime = new Date(st.startTime);
        return sessionTime >= dayStart && sessionTime < dayEnd;
      })
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );

    const groups = filtered.reduce(
      (acc, session) => {
        const theaterId = session.theater.id;

        if (!acc[theaterId]) {
          acc[theaterId] = {
            theater: session.theater,
            showTimes: [],
          };
        }

        acc[theaterId].showTimes.push(session);

        return acc;
      },
      {} as Record<number, TheaterShowTimes>,
    );

    return Object.values(groups);
  }, [showTimesQuery.data, selectedDate]);

  useEffect(() => {
    if (groupedShowTimes.length > 0 && !selectedTheaterId) {
      setSelectedTheaterId(groupedShowTimes[0].theater.id);
    }
  }, [groupedShowTimes]);

  const selectedTheater = groupedShowTimes.find(
    (group) => group.theater.id === selectedTheaterId,
  );

  if (showTimesQuery.isLoading)
    return <div className="text-purple-200">Загрузка...</div>;

  return (
    <div className="p-4 flex flex-col items-center w-full">
      <div className="flex gap-2 mb-8 overflow-x-auto w-full max-w-2xl pb-2">
        {/* Кнопки дат (можно оставить как были) */}
        {[0, 1, 2, 3, 4].map((offset) => {
          const date = format(addDays(new Date(), offset), "yyyy-MM-dd");
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap ${
                selectedDate === date
                  ? "bg-purple-600 text-white"
                  : "bg-purple-900/40 text-purple-300"
              }`}
            >
              {format(new Date(date), "d MMM", { locale: ru })}
            </button>
          );
        })}
      </div>
      <div className="flex gap-3 mb-6 overflow-x-auto">
        {groupedShowTimes.map((group) => (
          <button
            key={group.theater.id}
            onClick={() => setSelectedTheaterId(group.theater.id)}
            className={`
        px-5 py-3 rounded-xl whitespace-nowrap
        transition-all
        ${
          selectedTheaterId === group.theater.id
            ? "bg-purple-600 text-white"
            : "bg-purple-900/40 text-purple-300"
        }
      `}
          >
            {group.theater.name}
          </button>
        ))}
      </div>

      {groupedShowTimes.length > 0  && selectedTheater ? (
        <InstagramCanvasAfisha
          showTimes={selectedTheater.showTimes }
          theater={selectedTheater.theater}
          selectedDate={selectedDate}
          refetch={refetch}
        />
      ) : (
        <div className="text-purple-400">Сеансов не найдено</div>
      )}
    </div>
  );
}
