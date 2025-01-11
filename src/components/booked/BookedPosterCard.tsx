import { X } from 'lucide-react';
import { useBookedPosters } from '../../hooks/useBookedPosters';
import { baseURL } from '../../api/axios';
import { useBookings } from '../../hooks/useBookings';
import { BookedPoster } from '../../types/bookedPoster';

type BookedPosterCardProps = BookedPoster;

export function BookedPosterCard(props: BookedPosterCardProps) {
  const { removeBookedPoster } = useBookedPosters();
  const { deleteBookingMutation } = useBookings();
  const { mutate: deleteBooking } = deleteBookingMutation;
  const bookingDate = new Date(props.bookingDate).toLocaleDateString('ru-RU');

  const handleDeleteBooking = () => {
    deleteBooking({ id: Number(props.id), phone: props.phoneNumber });
    removeBookedPoster(props.id);
  };

  return (
    <div className="bg-purple-950/50 rounded-xl overflow-hidden shadow-lg">
      <div className="relative">
        <img
          src={`${baseURL}/${props.imageUrl}`}
          alt={props.title}
          className="w-full h-48 object-cover"
        />

        {!props.confirmation && (
          <button
            onClick={handleDeleteBooking}
            className="absolute top-2 right-2 p-1 bg-purple-900/80 rounded-full 
            text-purple-200 hover:bg-purple-800 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="p-6 space-y-3">
        <h3 className="text-xl font-semibold text-purple-200">{props.title}</h3>
        <div className="text-sm text-purple-300 space-y-1">
          <p>
            <span className="font-medium text-purple-100">Сеанс:</span> {props.showtime}
          </p>
          <p>
            <span className="font-medium text-purple-100">Мест:</span> {props.seats}
          </p>
          <p>
            <span className="font-medium text-purple-100">Телефон:</span> {props.phoneNumber}
          </p>
          {props.theater && (
            <p>
              <span className="font-medium text-purple-100">Зал:</span> {props.theater}
            </p>
          )}
          <p>
            <span className="font-medium text-purple-100">Дата бронирования:</span> {bookingDate}
          </p>
          {props.row && (
            <p>
              <span className="font-medium text-purple-100">Ряд:</span>{' '}
              {Array.from(new Set(props.row)).join(', ')}
            </p>
          )}
          {props.seatPerRow && (
            <p>
              <span className="font-medium text-purple-100">Место:</span>{' '}
              {props.seatPerRow.sort().join(', ')}
            </p>
          )}
          {props.product && (
            <p>
              <span className="font-medium text-purple-100">Подарок:</span> {props.product.name}
            </p>
          )}
          {props.confirmation && (
            <p className="text-green-500 font-semibold mt-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Ваша бронь подтверждена
            </p>
          )}
          <p className="text-purple-200 font-semibold">
            Итого: {props.totalPrice} ₽
          </p>
        </div>
      </div>
    </div>
  );
}
