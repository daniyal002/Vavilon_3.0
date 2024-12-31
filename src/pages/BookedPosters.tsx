import React from 'react';
import { BookedPostersList } from '../components/booked/BookedPostersList';

export function BookedPosters() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        Мои билеты
      </h1>
      <BookedPostersList />
    </div>
  );
}