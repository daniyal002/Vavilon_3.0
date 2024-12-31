import { Movie } from '../types/movie';

export const movies: Movie[] = [

  {
    id: 'movie-1',
    title: "Неоновый Горизонт 2077",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80",
    genres: ["Научная фантастика", "Боевик", "Триллер"],
    price: 300,
    showtime: "Сегодня 20:45",
    description: "В мире, где реальность сливается с цифровыми мечтами, один герой должен пройти по неоновым улицам Нового Токио, чтобы раскрыть заговор, угрожающий существованию человечества."
  },
  {
    id: 'movie-2',
    title: "Квантовые Сны",
    poster: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80",
    genres: ["Научная фантастика", "Драма", "Мистика"],
    price: 250,
    showtime: "Сегодня 21:30",
    description: "Захватывающее путешествие через квантовый мир, где сны и реальность переплетаются, бросая вызов нашему пониманию сознания."
  },
  {
    id: 'movie-3',
    title: "Темные Ночи",
    poster: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80",
    genres: ["Ужасы", "Триллер"],
    price: 300,
    showtime: "Сегодня 23:00",
    description: "Группа друзей сталкивается с необъяснимым злом во время ночной поездки, где каждая минута становится борьбой за выживание."
  }
];
