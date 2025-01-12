import { useState } from 'react';
import { X } from 'lucide-react';
import { useBookedPosters } from '../../hooks/useBookedPosters';
import { useBookings } from '../../hooks/useBookings';
import { baseURL } from '../../api/axios';
import { BookedPoster } from '../../types/bookedPoster';
import { QRCodeCanvas } from 'qrcode.react';

type BookedPosterCardProps = BookedPoster;

export function BookedPosterCard(props: BookedPosterCardProps) {
  const { removeBookedPoster } = useBookedPosters();
  const { deleteBookingMutation } = useBookings();
  const { mutate: deleteBooking } = deleteBookingMutation;
  const bookingDate = new Date(props.bookingDate).toLocaleDateString('ru-RU');
  const [isFlipped, setIsFlipped] = useState(false);

  const handleDeleteBooking = () => {
    deleteBooking(
      { id: Number(props.id), phone: props.phoneNumber },
      {
        onSuccess() {
          removeBookedPoster(props.id);
        },
      }
    );
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="relative w-full max-w-xs sm:max-w-sm mx-auto bg-purple-900/40 shadow-lg rounded-xl 
      transform transition-transform duration-300 hover:scale-105 perspective-1000 cursor-pointer"
      onClick={toggleFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d
        ${isFlipped ? '-rotate-y-180' : ''}`}
      >
        {/* Лицевая сторона */}
        <div
          className={`w-full h-full bg-purple-900/40 rounded-xl overflow-hidden 
          transition-opacity duration-700 backface-hidden
          ${isFlipped ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
        >
          {/* Изображение */}
          <div className="relative h-48 w-full">
            <img
              src={`${baseURL}/${props.imageUrl}`}
              alt={props.title}
              className="inset-0 w-full h-full object-cover"
            />

            {!props.confirmation && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBooking();
                }}
                className="absolute top-1 right-1 bg-purple-600 text-white p-1 rounded-full hover:bg-purple-800 transition-colors duration-300"
                aria-label="Удалить бронь"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Детали бронирования */}
          <div className="p-4 space-y-2">
            <h3 className="text-xl font-bold text-purple-300">{props.title}</h3>

            <div className="text-sm text-white space-y-1">
              <p>
                <span className="font-semibold">Сеанс: </span>
                {new Date(props.date).toLocaleDateString('ru-RU')}-
                {props.showtime}
              </p>

              {props.seatPerRow ? (
                <p>
                  <span className="font-semibold">Места: </span>
                  {props.seatPerRow}
                </p>
              ) : (
                <p>
                  <span className="font-semibold">Места: </span> {props.seats}
                </p>
              )}
              <p>
                <span className="font-semibold">Телефон: </span>
                {props.phoneNumber}
              </p>

              {props.confirmation && (
                <div className="text-green-600 font-semibold mt-2">
                  Бронь подтверждена
                </div>
              )}

              <div className="pt-2 font-bold text-lg text-purple-300">
                Итого: {props.totalPrice} ₽
              </div>
            </div>
          </div>
        </div>

        {/* Оборотная сторона (QR-код) */}
        <div
          className={` absolute top-0 left-0 w-full h-full  rounded-xl flex items-center justify-center
          transition-opacity duration-700 rotate-y-180
          ${isFlipped ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
          <div className="text-center p-4 z-40">
            <QRCodeCanvas
              value={`Бронь: ${props.id}\nФильм: ${props.title}\nСеанс: ${props.showtime}`}
              size={256}
              bgColor="#3b0764"
              fgColor="#fff"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
