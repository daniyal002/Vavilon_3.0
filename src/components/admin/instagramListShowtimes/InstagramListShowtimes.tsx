import { format, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState, useEffect, useRef } from 'react';
import { useShowTimes } from '../../../hooks/useShowTimes';
import { ShowTime } from '../../../types/showtime';
import { InstagramItemShowtimes } from './InstagramItemShowtimes';
import html2canvas from 'html2canvas';

export function InstagramListShowtimes() {
  const captureRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const { showTimesQuery } = useShowTimes();

  useEffect(() => {
    if (showTimesQuery.data && showTimesQuery.data.showTimes.length > 0) {
      setSelectedTheater(showTimesQuery.data.showTimes[0].theater.id.toString());
    }
  }, [showTimesQuery.data]);

  useEffect(() => {
    const images = captureRef.current?.querySelectorAll("img");
    if (!images) return;

    let loadedCount = 0;
    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            setIsLoaded(true);
          }
        };
      }
    });

    if (loadedCount === images.length) {
      setIsLoaded(true);
    }
  }, [showTimesQuery]);

  if (showTimesQuery.isLoading) {
    return <div className="text-purple-200">Загрузка...</div>;
  }

  if (showTimesQuery.isError) {
    return <div className="text-red-400">Ошибка загрузки данных</div>;
  }

  const currentDate = new Date();
  const activeShowTimes = (showTimesQuery.data?.showTimes || []).filter(
    (showTime) => new Date(showTime.endTime) > currentDate
  );

  const getShowDate = (showTime: ShowTime) => {
    const startTime = new Date(showTime.startTime);
    const showDate = new Date(showTime.date);
    const fiveAM = new Date(showDate);
    fiveAM.setHours(5, 0, 0, 0);

    return startTime.toLocaleDateString("ru-Ru", {
      hour: '2-digit',
      minute: '2-digit',
      day: "2-digit",
      timeZone: "UTC"
    }) < fiveAM.toLocaleDateString("ru-Ru", {
      hour: '2-digit',
      minute: '2-digit',
      day: "2-digit"
    })
      ? format(addDays(showDate, -1), 'yyyy-MM-dd')
      : format(showDate, 'yyyy-MM-dd');
  };

  const filteredShowTimes = activeShowTimes
    .filter((showTime) => {
      const theaterMatch =
        selectedTheater === 'all' ||
        showTime.theater.id.toString() === selectedTheater;
      const showTimeDate = getShowDate(showTime);
      return theaterMatch && showTimeDate === selectedDate;
    })
    .sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  const uniqueTheaters = Array.from(
    new Map(showTimesQuery.data?.showTimes.map((st) => [st.theater.id, st.theater])).values()
  );

  const uniqueDates = Array.from(
    new Set(activeShowTimes.map((st) => getShowDate(st)))
  ).sort();

  const handleDownload = async () => {
    if (!captureRef.current || !isLoaded) return;

    const container = captureRef.current;
    const originalStyles = {
      width: container.style.width,
      height: container.style.height,
      transform: container.style.transform,
      position: container.style.position,
      top: container.style.top,
      left: container.style.left,
      background: container.style.background
    };

    try {
      // Set styles for capture
      container.style.width = '640px';
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.background = 'transparent';

      // Calculate total height of content
      container.style.height = '200px';

      const canvas = await html2canvas(container, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
        width: 640,
        height: 1200,
        windowWidth: 640,
        windowHeight: 1200
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "afisha_instagram.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, "image/png");
    } finally {
      // Restore original styles
      Object.entries(originalStyles).forEach(([key, value]) => {
        container.style[key as any] = value;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 mb-10">
        {selectedTheater && (
          <div className="w-full overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {uniqueTheaters.map((theater) => (
                <button
                  key={theater.id}
                  onClick={() => setSelectedTheater(theater.id.toString())}
                  className={`px-4 py-3 rounded-lg whitespace-nowrap min-w-[100px] ${
                    selectedTheater === theater.id.toString()
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800'
                  }`}
                >
                  {theater.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {uniqueDates.map((date) => {
              const isToday = format(new Date(), 'yyyy-MM-dd') === date;
              const isTomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd') === date;

              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-4 py-3 rounded-lg whitespace-nowrap min-w-[100px] ${
                    selectedDate === date
                      ? 'bg-purple-600/80 text-white'
                      : 'bg-purple-900/50 text-purple-300'
                  }`}
                >
                  {isToday
                    ? 'Сегодня'
                    : isTomorrow
                    ? 'Завтра'
                    : format(new Date(date), 'd MMM', { locale: ru })}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-[640px] mx-auto h-full ">
        <div className="grid gap-4 " ref={captureRef}>
          {filteredShowTimes.map((showTime) => (
            <InstagramItemShowtimes
              key={showTime.id}
              {...showTime}
              ENABLE_PROMOCODE={showTimesQuery.data?.ENABLE_PROMOCODE as boolean}
            />
          ))}
        </div>

        <button
          onClick={handleDownload}
          disabled={!isLoaded}
          className="w-full bg-purple-600 text-white py-2 mt-4 rounded-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed"
        >
          {isLoaded ? '📸 Скачать афишу' : 'Загрузка изображений...'}
        </button>
      </div>
    </div>
  );
}