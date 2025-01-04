interface SeatSelectorProps {
  rows: number;
  seatsPerRow: number;
  selectedSeats: Array<{ row: number; seat: number }>;
  onSelect: (row: number, seat: number) => void;
  maxSeats?: number;
  bookedSeats?: Array<{ row: number; seat: number }>;
}

export function SeatSelector({
  rows,
  seatsPerRow,
  selectedSeats,
  onSelect,
  maxSeats = 10,
  bookedSeats = [],
}: SeatSelectorProps) {
  const isSeatSelected = (row: number, seat: number) => {
    return selectedSeats.some((s) => s.row === row && s.seat === seat);
  };

  const isSeatBooked = (row: number, seat: number) => {
    return bookedSeats.some((s) => s.row === row && s.seat === seat);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-purple-200 font-semibold">Выберите места</h3>
        <span className="text-sm text-purple-400">
          Выбрано: {selectedSeats.length} из {maxSeats}
        </span>
      </div>

      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 justify-center">
            <span className="text-purple-400 w-6 text-right">
              {rowIndex + 1}
            </span>
            <div className="flex gap-2">
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
                    className={`w-8 h-8 rounded-lg transition-all duration-200
                      ${
                        isBooked
                          ? 'bg-red-900/50 cursor-not-allowed'
                          : isSeatSelected(rowIndex + 1, seatIndex + 1)
                          ? 'bg-purple-600 shadow-lg shadow-purple-500/50'
                          : 'bg-purple-900/50 hover:bg-purple-800/50 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                  >
                    <span className="text-xs text-purple-200">
                      {seatIndex + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
