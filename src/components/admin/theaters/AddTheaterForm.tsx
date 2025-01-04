import { useState } from 'react';
import { useTheaters } from '../../../hooks/useTheaters';
import { Plus } from 'lucide-react';

export function AddTheaterForm() {
  const [name, setName] = useState('');
  const [type, setType] = useState<'REGULAR' | 'VIP'>('REGULAR');
  const [rows, setRows] = useState('');
  const [seatsPerRow, setSeatsPerRow] = useState('');

  const { createTheaterMutation } = useTheaters();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createTheaterMutation.mutate({
      name,
      type,
      rows: type === 'VIP' ? Number(rows) : 0,
      seatsPerRow: type === 'VIP' ? Number(seatsPerRow) : 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-purple-300 mb-2">
          Название зала
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 
            rounded-lg text-purple-100 placeholder-purple-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-purple-300 mb-2">
          Тип зала
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'REGULAR' | 'VIP')}
          className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 
            rounded-lg text-purple-100"
          required
        >
          <option value="REGULAR">Обычный</option>
          <option value="VIP">VIP</option>
        </select>
      </div>

      {type === 'VIP' && (
        <>
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Количество рядов
            </label>
            <input
              type="number"
              min="1"
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 
                rounded-lg text-purple-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Мест в ряду
            </label>
            <input
              type="number"
              min="1"
              value={seatsPerRow}
              onChange={(e) => setSeatsPerRow(e.target.value)}
              className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 
                rounded-lg text-purple-100"
              required
            />
          </div>
        </>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={createTheaterMutation.isPending}
          className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
            font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
            transition-all duration-300 active:scale-95 hover:scale-[1.02]
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus size={18} />
        <span>Добавить</span>
        </button>
      </div>
    </form>
  );
}
