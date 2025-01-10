import React, { useState } from 'react';
import { X } from 'lucide-react';
import { NumberInput } from './booking/NumberInput';
import { PromoCodeInput } from './booking/PromoCodeInput';
import { PhoneInput } from './booking/PhoneInput';
import { useBookedPosters } from '../hooks/useBookedPosters';
import { BookedPoster } from '../types/bookedPoster';
import { ShowTime } from '../types/showtime';
import { formatTime } from '../utils/formatters';
import { useBookings } from '../hooks/useBookings';
import { usePromoCodes } from '../hooks/usePromoCodes';
import { SeatSelector } from './booking/SeatSelector';
import { Product } from '../types/product';

interface BookingFormProps {
  showTime: ShowTime;
  onCancel: () => void;
  onSuccess?: () => void;
  onClose: () => void;
  editMode?: boolean;
  initialBooking?: BookedPoster;
}

export function BookingForm({
  showTime,
  onCancel,
  onSuccess,
  onClose,
  editMode = false,
  initialBooking,
}: BookingFormProps) {
  const [seats, setSeats] = useState(editMode ? initialBooking?.seats || 1 : 1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<
    Array<{ row: number; seat: number }>
  >([]);
  const [promoCodeProduct, setPromoCodeProduct] = useState<Product>();

  const basePrice =
    showTime.price *
    (showTime.theater.type === 'VIP' ? selectedSeats.length : seats);

  const totalPrice = basePrice - basePrice * discount;

  const { addBookedPoster, editBookedPoster } = useBookedPosters();
  const { createBookingMutation } = useBookings();
  const { useCheckPromoCode } = usePromoCodes();
  const promoCodeQuery = useCheckPromoCode(promoCode, {
    enabled: false,
  });

  const { mutate: createBooking } = createBookingMutation;

  const isPhoneValid = phoneNumber.replace(/\D/g, '').length === 11;

  const handleSeatSelect = (row: number, seat: number) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.row === row && s.seat === seat);
      if (isSelected) {
        return prev.filter((s) => !(s.row === row && s.seat === seat));
      }
      return [...prev, { row, seat }];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createBooking(
      {
        showTimeId: showTime.id,
        phone: phoneNumber.replace(/\D/g, ''),
        reservedSeats:
          showTime.theater.type === 'VIP' ? selectedSeats.length : seats,
        totalAmount: totalPrice,
        row:
          showTime.theater.type === 'VIP'
            ? selectedSeats.map((s) => s.row)
            : undefined,
        seatPerRow:
          showTime.theater.type === 'VIP'
            ? selectedSeats.map((s) => s.seat)
            : undefined,
        productId:promoCodeProduct?.id
        
      },
      {
        onSuccess: () => {
          addBookedPoster({
            id: showTime.id.toString(),
            title: showTime.movie.title,
            imageUrl: showTime.movie.imagePath as string,
            phoneNumber: phoneNumber.replace(/\D/g, ''),
            seats:
              showTime.theater.type === 'VIP' ? selectedSeats.length : seats,
            totalPrice: totalPrice,
            showtime: formatTime(showTime.startTime.toString()),
            bookingDate: new Date().toISOString(),
            movieId: showTime.movieId.toString(),
            row:
              showTime.theater.type === 'VIP'
                ? selectedSeats.map((s) => s.row)
                : undefined,
            seatPerRow:
              showTime.theater.type === 'VIP'
                ? selectedSeats.map((s) => s.seat)
                : undefined,
            theaterType: showTime.theater.type,
            theater: showTime.theater.name,
            product:promoCodeProduct
          });
          onSuccess?.();
          onClose?.();
        },
      }
    );
  };

  const handleApplyPromo = () => {
    setPromoError('');

    if (!promoCode) {
      setPromoError('Введите промокод');
      return;
    }

    promoCodeQuery.refetch().then(({ data, error }) => {
      if (error) {
        setPromoError('Ошибка при проверке промокода');
        setDiscount(0);
        return;
      }

      if (!data) {
        setPromoError('Промокод не найден');
        setDiscount(0);
        return;
      }

      if (data.type === 'PERCENTAGE') {
        setDiscount(data.value / 100);
        setPromoCodeProduct(undefined);
      } else if (data.type === 'FIXED') {
        setDiscount(data.value / basePrice);
        setPromoCodeProduct(undefined);
      } else {
        setPromoCodeProduct(data.product);
        setDiscount(0);
      }
    });
  };

  const bookedSeats =
    showTime.bookings?.flatMap((booking) =>
      booking.row.map((row, index) => ({
        row,
        seat: booking.seatPerRow[index],
      }))
    ) || [];

  return (
    <div className="bg-purple-950/50 rounded-xl p-6 shadow-lg animate-fadeSlide">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          {editMode ? 'Редактирование брони' : 'Бронирование билетов'}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-purple-200 mb-2">
            {showTime.movie.title}
          </h4>
          <p className="text-sm text-purple-300">
            Сеанс: {formatTime(showTime.startTime.toString())}
          </p>
        </div>

        <PhoneInput
          value={phoneNumber}
          onChange={setPhoneNumber}
          label="Номер телефона"
          required={true}
        />

        {showTime.theater.type === 'VIP' ? (
          showTime.theater.rows &&
          showTime.theater.seatsPerRow && (
            <SeatSelector
              rows={showTime.theater.rows}
              seatsPerRow={showTime.theater.seatsPerRow}
              selectedSeats={selectedSeats}
              onSelect={handleSeatSelect}
              maxSeats={showTime.theater.rows * showTime.theater.seatsPerRow}
              bookedSeats={bookedSeats}
            />
          )
        ) : (
          <NumberInput
            label="Количество мест"
            value={seats}
            onChange={setSeats}
            min={1}
            max={showTime.availableSeats}
          />
        )}

        <PromoCodeInput
          value={promoCode}
          onChange={setPromoCode}
          onApply={handleApplyPromo}
          error={promoError}
        />

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-purple-300">Скидка:</span>
            <span className="text-green-400">
              {Math.round(discount * 100)}% (-{Math.round(basePrice * discount)}{' '}
              ₽)
            </span>
          </div>
        )}

        {promoCodeProduct && (
          <div className="flex justify-between text-sm">
            <span className="text-purple-300">Подарок:</span>
            <span className="text-green-400">{promoCodeProduct.name}</span>
          </div>
        )}

        <div className="pt-4 border-t border-purple-700/30">
          <div className="flex justify-between text-lg font-semibold text-purple-200 mb-6">
            <span>Итого:</span>
            <span>{totalPrice} ₽</span>
          </div>

          <button
            type="submit"
            disabled={!isPhoneValid}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
              font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
              transition-all duration-300 active:scale-95 hover:scale-[1.02]
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Подтвердить бронирование
          </button>
        </div>
      </form>
    </div>
  );
}
