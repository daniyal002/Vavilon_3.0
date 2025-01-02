import { Booking } from './booking';
import { Movie } from './movie';
import { Theater } from './theater';

export interface ShowTime {
  id: number;
  movieId: number;
  theaterId: number;
  startTime: Date;
  endTime: Date;
  price: number;
  date: Date;
  seatsAvailable: number;
  movie: Movie;
  theater: Theater;
  bookings: Booking[];
  reservedSeatsCount?: number;
}

export interface CreateShowTimeDTO {
  movieId: number;
  theaterId: number;
  startTime: string;
  endTime: string;
  price: number;
  date: string;
  seatsAvailable: number;
}

export interface UpdateShowTimeDTO extends Partial<CreateShowTimeDTO> {
  id: number;
}
