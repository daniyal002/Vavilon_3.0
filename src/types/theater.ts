export type TheaterType = 'REGULAR' | 'VIP' | 'FLEXIBLE';

export interface Theater {
  id: number;
  name: string;
  type: TheaterType;
  rows?: number;
  seatsPerRow?: number;
  rowLayout?: Row[];  
}

export interface Row {
  id?: number;
  number: number;    // номер ряда
  seats: number;     // количество мест в ряду
}