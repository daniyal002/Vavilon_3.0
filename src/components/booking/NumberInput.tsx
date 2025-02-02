import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
}

export function NumberInput({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
}: NumberInputProps) {
  const [error, setError] = useState<string | null>(null);

  const decrease = () => {
    if (value > min) onChange(value - 1);
  };

  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (newValue > max) {
      setError(
        `Невозможно забронировать больше ${max} мест - все остальные места заняты`
      );
      return;
    }
    if (newValue >= min && newValue <= max) {
      setError(null);
      onChange(newValue);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-purple-200 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={decrease}
          disabled={value <= min}
          className="p-2 rounded-lg bg-purple-900/50 border border-purple-700/50 text-purple-200 
            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-800/50 transition-colors"
        >
          <Minus size={16} />
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/50 rounded-lg 
            text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
        />
        <button
          type="button"
          onClick={increase}
          disabled={value >= max}
          className="p-2 rounded-lg bg-purple-900/50 border border-purple-700/50 text-purple-200 
            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-800/50 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}
