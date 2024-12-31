import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddTheaterFormProps {
  onAdd: (theater: {
    name: string;
    location?: string;
    capacity?: number;
  }) => void;
  isLoading: boolean;
}

export function AddTheaterForm({ onAdd, isLoading }: AddTheaterFormProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd({
        name,
        location: location || undefined,
        capacity: capacity ? parseInt(capacity) : undefined,
      });
      setName('');
      setLocation('');
      setCapacity('');
    }
  };

  return (
    <div className="bg-purple-950/50 rounded-xl p-4 md:p-6 shadow-lg">
      <h3 className="text-base md:text-lg font-semibold text-purple-200 mb-3 md:mb-4">
        Добавить новый зал
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название зала"
          className="w-full p-2.5 md:p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500
            text-sm md:text-base"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Расположение (необязательно)"
          className="w-full p-2.5 md:p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500
            text-sm md:text-base"
        />
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="Вместимость (необязательно)"
          className="w-full p-2.5 md:p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500
            text-sm md:text-base"
        />
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || isLoading}
          className="w-full px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
            font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
            transition-all duration-300 active:scale-95 hover:scale-[1.02]
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
            text-sm md:text-base"
        >
          <Plus size={18} className="md:w-5 md:h-5" />
          <span>Добавить</span>
        </button>
      </div>
    </div>
  );
}
