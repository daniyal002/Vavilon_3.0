export interface Genre {
  id: number;
  name: string;
  movies?: Movie[];
}

export interface Movie {
  id: number;
  title: string;
  // ... другие поля
}
