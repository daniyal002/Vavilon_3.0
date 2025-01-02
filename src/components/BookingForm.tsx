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
  const totalPrice = showTime.price * seats;
  const { addBookedPoster, editBookedPoster } = useBookedPosters();
  const { createBookingMutation } = useBookings();

  const { mutate: createBooking } = createBookingMutation;

  const isPhoneValid = phoneNumber.replace(/\D/g, '').length === 11;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPhoneValid) {
      return;
    }

    const bookingData = {
      seats,
      phoneNumber: phoneNumber.replace(/[^\d]/g, ''),
      totalPrice,
      bookingDate:
        editMode && initialBooking
          ? initialBooking.bookingDate
          : new Date().toISOString(),
    };

    if (editMode && initialBooking) {
      editBookedPoster(initialBooking.id, bookingData);
      createBooking({
        showTimeId: showTime.id,
        phone: phoneNumber.replace(/[^\d]/g, ''),
        reservedSeats: seats,
        totalAmount: totalPrice,
      });
    } else {
      const newBooking = {
        id: showTime.id.toString(),
        movieId: showTime.movie.id?.toString() || '',
        title: showTime.movie.title,
        imageUrl: showTime.movie.imagePath || '',
        showtime: formatTime(showTime.startTime.toString()),
        ...bookingData,
      };
      addBookedPoster(newBooking);
      createBooking({
        showTimeId: showTime.id,
        phone: phoneNumber.replace(/[^\d]/g, ''),
        reservedSeats: seats,
        totalAmount: totalPrice,
      });
    }

    onSuccess?.();
    onClose();
  };

  const handleApplyPromo = () => {
    // Логика применения промокода
  };

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

        <NumberInput
          label="Количество мест"
          value={seats}
          onChange={setSeats}
          min={1}
          max={10}
        />

        <PromoCodeInput
          value={promoCode}
          onChange={setPromoCode}
          onApply={handleApplyPromo}
        />

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
