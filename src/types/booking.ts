import { Movie } from './movie';
import { Product } from './product';
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
  productId?:number;
  product?:Product
}

export interface CreateBookingDTO {
  showTimeId: number;
  phone: string;
  reservedSeats: number;
  totalAmount: number;
  row?: number[];
  seatPerRow?: number[];
  productId?:number;

}

export interface UpdateBookingDTO {
  showTimeId?: number;
  phone?: string;
  reservedSeats?: number;
  totalAmount?: number;
  confirmation?: boolean;
  row?: number;
  seatPerRow?: number;
  productId?:number;

}
