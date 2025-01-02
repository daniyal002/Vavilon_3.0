import { X } from 'lucide-react';
import { useBookedPosters } from '../../hooks/useBookedPosters';
import { baseURL } from '../../api/axios';
import { useBookings } from '../../hooks/useBookings';

interface BookedPosterCardProps {
  id: string;
  title: string;
  imageUrl: string;
  showtime: string;
  seats: number;
  phoneNumber: string;
  totalPrice: number;
  bookingDate: string;
}

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
        <img src={`${baseURL}/${props.imageUrl}`} alt={props.title} className="w-full h-48 object-cover" />
        <button
          onClick={handleDeleteBooking}
          className="absolute top-2 right-2 p-1 bg-purple-900/80 rounded-full 
            text-purple-200 hover:bg-purple-800 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-purple-200">{props.title}</h3>
        <div className="text-sm text-purple-300 space-y-1">
          <p>Сеанс: {props.showtime}</p>
          <p>Мест: {props.seats}</p>
          <p>Телефон: {props.phoneNumber}</p>
          <p>Дата бронирования: {bookingDate}</p>
          <p className="text-purple-200 font-semibold">Итого: {props.totalPrice} ₽</p>
        </div>
      </div>
    </div>
  );
}