export interface BookedPoster {
  id: string;
  movieId: string;
  title: string;
  imageUrl: string;
  showtime: string;
  seats: number;
  phoneNumber: string;
  totalPrice: number;
  bookingDate: string;
}