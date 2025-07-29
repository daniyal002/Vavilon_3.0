import { useSeatTypes } from "../../hooks/useSeatTypes";
import { Row } from "../../types/theater";

interface SeatSelectorProps {
  rows: number;
  seatsPerRow: number;
  selectedSeats: Array<{ row: number; seat: number }>;
  onSelect: (row: number, seat: number) => void;
  maxSeats?: number;
  bookedSeats?: Array<{ row: number; seat: number }>;
  layoutType: 'VIP' | 'FLEXIBLE';
  rowLayout?:Row[]
}

export function SeatSelector({
  rows,
  seatsPerRow,
  selectedSeats,
  onSelect,
  maxSeats = 10,
  bookedSeats = [],
  layoutType,
  rowLayout
}: SeatSelectorProps) {
  const isSeatSelected = (row: number, seat: number) => {
    return selectedSeats.some((s) => s.row === row && s.seat === seat);
  };

  const isSeatBooked = (row: number, seat: number) => {
    return bookedSeats.some((s) => s.row === row && s.seat === seat);
  };

  const {seatTypesQuery} = useSeatTypes()

  const seatTypes = seatTypesQuery.data || [];


return (
  <div className="space-y-4 md:space-y-8">
    <div className="flex justify-between items-center">
      <h3 className="text-purple-200 font-semibold text-sm md:text-base">
        Выберите места
      </h3>
      <span className="text-xs md:text-sm text-purple-400">
        Выбрано: {selectedSeats.length} из {maxSeats}
      </span>
    </div>

    {layoutType === 'VIP' ? (
      // 🎯 Старый круглый стиль (оставляем как есть)
      <div className="relative aspect-square mx-auto max-w-[340px]">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 md:w-24">
          <div className="w-full h-1 bg-purple-500/20 rounded-full" />
          <div className="text-center text-xs text-purple-400 mt-2">Экран</div>
        </div>
        <div className="absolute inset-2 xs:inset-1 border-2 border-purple-500/20 rounded-full" />
        <div className="absolute inset-4 xs:inset-5 border border-purple-500/10 rounded-full" />

        <div className="relative inset-0 h-full">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} style={{ position: 'absolute', left: '50%', top: '50%' }}>
              <div className="flex gap-1 md:gap-1.5 -translate-x-1/2 justify-center items-center">
                <span className="xs:block hidden text-purple-400 text-[10px] md:text-xs w-3 md:w-4 text-right">
                  {rowIndex + 1}
                </span>
                <div className="flex gap-1 md:gap-1.5">
                  {Array.from({ length: seatsPerRow }).map((_, seatIndex) => {
                    const isBooked = isSeatBooked(rowIndex + 1, seatIndex + 1);
                    return (
                      <button
                        type="button"
                        key={seatIndex}
                        onClick={() => onSelect(rowIndex + 1, seatIndex + 1)}
                        disabled={
                          isBooked ||
                          (selectedSeats.length >= maxSeats &&
                            !isSeatSelected(rowIndex + 1, seatIndex + 1))
                        }
                        className={`w-6 h-6 rounded transition-all duration-200 transform hover:scale-110
                          ${
                            isBooked
                              ? 'bg-red-900/50 cursor-not-allowed'
                              : isSeatSelected(rowIndex + 1, seatIndex + 1)
                              ? 'bg-purple-600 shadow-lg shadow-purple-500/50'
                              : 'bg-purple-900/50 hover:bg-purple-800/50 disabled:opacity-50 disabled:cursor-not-allowed'
                          }`}
                      >
                        <span className="text-[8px] md:text-xs text-purple-200">
                          {seatIndex + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      // 📦 Прямоугольная FLEXIBLE раскладка
      rowLayout?.map((row) => (
  <div key={row.number} className="flex items-center gap-2">
    <span className="text-xs text-purple-400 w-4 text-right">
      {row.number}
    </span>
    <div className="flex gap-2 flex-wrap">
      {row.seats.map((seat) => {
        const isBooked = isSeatBooked(row.number, seat.number);
        const isSelected = isSeatSelected(row.number, seat.number);
        const seatType = seatTypes.find((st) => st.id === seat.seatTypeId);

        return (
          <button
            key={seat.number}
            type="button"
            onClick={() => onSelect(row.number, seat.number)}
            disabled={
              isBooked ||
              (selectedSeats.length >= maxSeats && !isSelected)
            }
            className={`w-6 h-6 rounded text-[10px] text-white flex items-center justify-center transition-all duration-200 
              ${isBooked
                ? 'bg-gray-500 cursor-not-allowed'
                : isSelected
                ? 'border border-red-500/50'
                : 'hover:scale-110 bg-[#5b21b6]'}
            `}
            title={seatType?.name}
          >
            <span className="text-[8px] md:text-xs text-purple-200 font-bold">
                       {seatType?.name[0].toUpperCase()}
                      </span>
          </button>
        );
      })}
    </div>
  </div>
))
    )}
  </div>
);
}
