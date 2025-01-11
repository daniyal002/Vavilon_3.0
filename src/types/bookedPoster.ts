import { Product } from "./product";

export interface BookedPoster {
  id: string;
  movieId: string;
  title: string;
  imageUrl: string;
  showtime: string;
  endTime:string;
  date:string
  seats: number;
  phoneNumber: string;
  totalPrice: number;
  bookingDate: string;
  row?: number[];
  seatPerRow?: number[];
  theaterType?: string;
  theater?:string;
  product?:Product;
  confirmation?:boolean
}