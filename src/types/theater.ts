export type TheaterType = 'REGULAR' | 'VIP' | 'FLEXIBLE';

export interface SeatType {
  id: number;
  name: string;
  color?: string;
  price?: number;
}

export interface Seat {
  id?: number;
  number: number;       // номер места в ряду
  seatType: SeatType;   // тип места (пуфик, диван и т.п.)
  seatTypeId?: number;  // для отправки на бэкенд
}

export interface Row {
  id?: number;
  number: number;      // номер ряда
  seats: Seat[];       // массив мест в ряду
}

export interface Theater {
  id: number;
  name: string;
  type: TheaterType;
  rows?: number;        // только для REGULAR/VIP
  seatsPerRow?: number; // только для REGULAR/VIP
  rowLayout?: Row[];    // только для FLEXIBLE
}
