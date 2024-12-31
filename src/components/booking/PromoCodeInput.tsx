import React, { useState } from 'react';

interface PromoCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
}

export function PromoCodeInput({ value, onChange, onApply }: PromoCodeInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-purple-200 mb-2">
        Промокод
      </label>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-2 bg-purple-900/50 border border-purple-700/50 rounded-lg 
            text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Введите промокод"
        />
        <button
          type="button"
          onClick={onApply}
          disabled={!value}
          className="px-4 py-2 bg-purple-900/50 border border-purple-700/50 rounded-lg text-purple-200 
            hover:bg-purple-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Применить
        </button>
      </div>
    </div>
  );
}