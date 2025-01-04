interface PromoCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  error?: string;
}

export function PromoCodeInput({
  value,
  onChange,
  onApply,
  error,
}: PromoCodeInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-col">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Введите промокод"
          className="flex-1 px-4 py-2 bg-purple-900/50 border border-purple-700/30 
            rounded-lg text-purple-100 placeholder-purple-400 uppercase"
        />
        <button
          type="button"
          onClick={onApply}
          className="px-4 py-2 bg-purple-600 rounded-lg font-semibold text-white
            hover:bg-purple-500 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Применить
        </button>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
