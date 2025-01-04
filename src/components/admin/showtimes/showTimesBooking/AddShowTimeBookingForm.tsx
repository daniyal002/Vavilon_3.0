import { useState } from 'react';
import { useBookings } from '../../../../hooks/useBookings';
import { useShowTimes } from '../../../../hooks/useShowTimes';
import { format } from 'date-fns';
import { SeatSelector } from '../../../booking/SeatSelector';
import { NumberInput } from '../../../booking/NumberInput';
import { PhoneInput } from '../../../booking/PhoneInput';

interface AddShowTimeBookingFormProps {
  onSuccess: () => void;
}

export function AddShowTimeBookingForm({
  onSuccess,
}: AddShowTimeBookingFormProps) {
  const [phone, setPhone] = useState('');
  const [seats, setSeats] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<
    Array<{ row: number; seat: number }>
  >([]);
  const [selectedShowTimeId, setSelectedShowTimeId] = useState('');

  const { createBookingMutation } = useBookings();
  const { showTimesQuery } = useShowTimes();
  const { data: showTimes } = showTimesQuery;

  const selectedShowTime = showTimes?.find(
    (st) => st.id === Number(selectedShowTimeId)
  );
  const isVIP = selectedShowTime?.theater.type === 'VIP';
  const maxSeats = selectedShowTime?.availableSeats || 0;
  const totalAmount = selectedShowTime
    ? isVIP
      ? selectedShowTime.price * selectedSeats.length
      : selectedShowTime.price * seats
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShowTime) return;

    createBookingMutation.mutate(
      {
        showTimeId: selectedShowTime.id,
        phone,
        reservedSeats: isVIP ? selectedSeats.length : seats,
        row: isVIP ? selectedSeats.map((s) => s.row) : undefined,
        seatPerRow: isVIP ? selectedSeats.map((s) => s.seat) : undefined,
        totalAmount,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  return (
    <div className="bg-purple-950/50 rounded-xl p-6 shadow-lg mb-6">
      <h3 className="text-xl font-bold text-purple-200 mb-4">
        Добавить бронирование
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Выберите сеанс
          </label>
          <select
            value={selectedShowTimeId}
            onChange={(e) => {
              setSelectedShowTimeId(e.target.value);
              setSelectedSeats([]);
              setSeats(1);
            }}
            className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-200"
            required
          >
            <option value="">Выберите сеанс</option>
            {showTimes?.map((showTime) => (
              <option key={showTime.id} value={showTime.id}>
                {showTime.movie.title} -{' '}
                {format(new Date(showTime.startTime), 'dd.MM.yyyy HH:mm')}(
                {showTime.theater.name})
              </option>
            ))}
          </select>
        </div>

        <PhoneInput
          label="Телефон"
          value={phone}
          onChange={(value) => setPhone(value)}
        />

        {selectedShowTime &&
          (isVIP ? (
            <SeatSelector
              rows={selectedShowTime.theater.rows || 0}
              seatsPerRow={selectedShowTime.theater.seatsPerRow || 0}
              selectedSeats={selectedSeats}
              onSelect={(row: number, seat: number) => {
                setSelectedSeats((prev) => {
                  const isSelected = prev.some(
                    (s) => s.row === row && s.seat === seat
                  );
                  if (isSelected) {
                    return prev.filter(
                      (s) => !(s.row === row && s.seat === seat)
                    );
                  }
                  return [...prev, { row, seat }];
                });
              }}
              maxSeats={maxSeats}
            />
          ) : (
            <NumberInput
              label="Количество мест"
              value={seats}
              onChange={setSeats}
              min={1}
              max={maxSeats}
            />
          ))}

        {selectedShowTime && (
          <div className="text-sm text-purple-300">Сумма: {totalAmount} ₽</div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="submit"
            disabled={!selectedShowTime}
            className="px-4 py-2 bg-purple-600/80 rounded-lg text-white disabled:opacity-50"
          >
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
}
