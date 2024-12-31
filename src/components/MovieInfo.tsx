import React from 'react';
import { Clock, BadgeRussianRuble } from 'lucide-react';

interface MovieInfoProps {
  showtime: string;
  price: number;
}

export function MovieInfo({ showtime, price }: MovieInfoProps) {
  return (
    <div className="flex items-center gap-4 text-purple-300 mb-4 md:mb-8 text-sm md:text-base">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-purple-400" />
        <span>{showtime}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-bold">{price.toFixed(2)}</span>
        <BadgeRussianRuble  size={16} className="text-purple-400" />
      </div>
    </div>
  );
}