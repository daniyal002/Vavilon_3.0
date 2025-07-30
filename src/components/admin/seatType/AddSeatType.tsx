import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddSeatTypeFormProps {
  onAdd: (name: string, color:string) => void;
  isLoading: boolean;
}

export function AddSeatTypeForm({ onAdd, isLoading }: AddSeatTypeFormProps) {
  const [newSeatTypeName, setNewSeatTypeName] = useState('');
  const [newSeatTypeColor, setNewSeatTypeColor] = useState('');

  return (
    <div className="bg-purple-950/50 rounded-xl p-4 md:p-6 shadow-lg">
      <h3 className="text-base md:text-lg font-semibold text-purple-200 mb-3 md:mb-4">
        Добавить новый тип места
      </h3>
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        <input
          type="text"
          value={newSeatTypeName}
          onChange={(e) => setNewSeatTypeName(e.target.value)}
          placeholder="Тип места"
          className="w-full p-2.5 md:p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500
            text-sm md:text-base"
        />
        <input
          type="color"
          value={newSeatTypeColor}
          onChange={(e) => setNewSeatTypeColor(e.target.value)}
          placeholder="Цвет типа места"
           className="w-full sm:h-auto p-2.5 md:p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
    text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500
    text-sm md:text-base"
        />
        <button
          onClick={() => {
            if (newSeatTypeName.trim()) {
              onAdd(newSeatTypeName,newSeatTypeColor);
              setNewSeatTypeName('');
              setNewSeatTypeColor('');
            }
          }}
          disabled={!newSeatTypeName.trim() || isLoading}
          className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
            font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
            transition-all duration-300 active:scale-95 hover:scale-[1.02]
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center sm:justify-start gap-2
            text-sm md:text-base"
        >
          <Plus size={18} className="md:w-5 md:h-5" />
          <span>Добавить</span>
        </button>
      </div>
    </div>
  );
}
