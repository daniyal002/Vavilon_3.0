export interface Theater {
  id: number;
  name: string;
  type: 'REGULAR' | 'VIP';
  rows: number;
  seatsPerRow: number;
}
