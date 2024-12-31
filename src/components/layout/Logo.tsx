import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <Clapperboard className="w-8 h-8 text-purple-400" />
      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient">
        Vavilon
      </span>
    </Link>
  );
}