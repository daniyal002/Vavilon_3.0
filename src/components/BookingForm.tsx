import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Movie } from '../types/movie';
import { NumberInput } from './booking/NumberInput';
import { PromoCodeInput } from './booking/PromoCodeInput';
import { PhoneInput } from './booking/PhoneInput';
import { useBookedPosters } from '../hooks/useBookedPosters';
import { BookedPoster } from '../types/bookedPoster';

interface BookingFormProps {
  movie: Movie;
  onCancel: () => void;
  onSuccess?: () => void;
  onClose: () => void;
  editMode?: boolean;
  initialBooking?: BookedPoster;
}

export function BookingForm({ 
  movie, 
  onCancel, 
  onSuccess, 
  onClose, 
  editMode = false,
  initialBooking 
}: BookingFormProps) {
  const [seats, setSeats] = useState(editMode ? initialBooking?.seats || 1 : 1);
  const [phoneNumber, setPhoneNumber] = useState(editMode ? initialBooking?.phoneNumber || '' : '');
  const [promoCode, setPromoCode] = useState('');
  const totalPrice = movie.price * seats;
  const { addBookedPoster, editBookedPoster } = useBookedPosters();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData = {
      seats,
      phoneNumber,
      totalPrice,
      bookingDate: editMode && initialBooking 
        ? initialBooking.bookingDate 
        : new Date().toISOString()
    };

    if (editMode && initialBooking) {
      editBookedPoster(initialBooking.id, bookingData);
    } else {
      const newBooking = {
        id: Date.now().toString(),
        movieId: movie.id,
        title: movie.title,
        imageUrl: movie.poster,
        showtime: movie.showtime,
        ...bookingData
      };
      addBookedPoster(newBooking);
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
          <h4 className="text-lg font-semibold text-purple-200 mb-2">{movie.title}</h4>
          <p className="text-sm text-purple-300">Сеанс: {movie.showtime}</p>
        </div>

        <PhoneInput
          value={phoneNumber}
          onChange={setPhoneNumber}
          label="Номер телефона"
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
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
              font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
              transition-all duration-300 active:scale-95 hover:scale-[1.02]"
          >
            Подтвердить бронирование
          </button>
        </div>
      </form>
    </div>
  );
}