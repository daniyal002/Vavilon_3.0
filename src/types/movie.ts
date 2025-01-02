import { Genre } from "./genre";

export interface Movie {
  id?: number;
  title: string;
  description: string;
  rating: number;
  year: number;
  ageRestriction: string;
  trailerLink: string;
  premiere: boolean;
  genreIds: number[];
  genres?: Genre[];
  imagePath?: string;
  image?: File;
}