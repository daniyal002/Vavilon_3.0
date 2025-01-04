import { Movie } from './movie';
import { ShowTime } from './showtime';
import { Theater } from './theater';

export interface Booking {
  id: number;
  showTimeId: number;
  userId?: number;
  phone: string;
  reservedSeats: number;
  totalAmount: number;
  confirmation: boolean;
  row: number[];
  seatPerRow: number[];
  showTime: ShowTime & {
    movie: Movie;
    theater: Theater;
  };
}

export interface CreateBookingDTO {
  showTimeId: number;
  phone: string;
  reservedSeats: number;
  totalAmount: number;
  row?: number[];
  seatPerRow?: number[];
}

export interface UpdateBookingDTO {
  showTimeId?: number;
  phone?: string;
  reservedSeats?: number;
  totalAmount?: number;
  confirmation?: boolean;
  row?: number;
  seatPerRow?: number;
}
