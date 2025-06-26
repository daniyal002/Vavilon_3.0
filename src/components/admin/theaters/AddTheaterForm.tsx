import { useState } from 'react';
import { useTheaters } from '../../../hooks/useTheaters';
import { Plus, PlusCircle, Trash2 } from 'lucide-react';
import { Row, TheaterType } from '../../../types/theater';

export function AddTheaterForm() {
  const [name, setName] = useState('');
  const [type, setType] = useState<TheaterType>('REGULAR');
  const [rows, setRows] = useState('');
  const [seatsPerRow, setSeatsPerRow] = useState('');

   // Для кастомных рядов:
  const [customRows, setCustomRows] = useState<Row[]>([]);

  const { createTheaterMutation } = useTheaters();

   // Добавить новый пустой ряд
  const addCustomRow = () => {
    setCustomRows([...customRows, { number: customRows.length + 1, seats: 1 }]);
  };

  // Удалить ряд по индексу
  const removeCustomRow = (index: number) => {
    const newRows = customRows.filter((_, i) => i !== index);
    // Переиндексация номеров рядов:
    setCustomRows(newRows.map((r, i) => ({ ...r, number: i + 1 })));
  };

  // Изменить значение ряда
  const updateCustomRow = (index: number, field: 'number' | 'seats', value: number) => {
    const newRows = [...customRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setCustomRows(newRows);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'FLEXIBLE') {
      if (customRows.length === 0) {
        alert('Добавьте хотя бы один ряд для кастомного типа');
        return;
      }
      createTheaterMutation.mutate({
        name,
        type,
        rowLayout: customRows,
        rows: undefined,
        seatsPerRow: undefined,
      });
    } else {
      createTheaterMutation.mutate({
        name,
        type,
        rows: Number(rows),
        seatsPerRow: Number(seatsPerRow),
        rowLayout: undefined,
      });
    }
  };

  // return (
  //   <form onSubmit={handleSubmit} className="space-y-4">
  //     <div>
  //       <label className="block text-sm font-medium text-purple-300 mb-2">
  //         Название зала
  //       </label>
  //       <input
  //         type="text"
  //         value={name}
  //         onChange={(e) => setName(e.target.value)}
  //         className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 
  //           rounded-lg text-purple-100 placeholder-purple-400"
  //         required
  //       />
  //     </div>

  //     <div>
  //       <label className="block text-sm font-medium text-purple-300 mb-2">
  //         Тип зала
  //       </label>
  //       <select
  //         value={type}
  //         onChange={(e) => setType(e.target.value as 'REGULAR' | 'VIP')}
  //         className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 
  //           rounded-lg text-purple-100"
  //         required
  //       >
  //         <option value="REGULAR">Обычный</option>
  //         <option value="VIP">VIP</option>
  //       </select>
  //     </div>

  //     {type === 'VIP' && (
  //       <>
  //         <div>
  //           <label className="block text-sm font-medium text-purple-300 mb-2">
  //             Количество рядов
  //           </label>
  //           <input
  //             type="number"
  //             min="1"
  //             value={rows}
  //             onChange={(e) => setRows(e.target.value)}
  //             className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 
  //               rounded-lg text-purple-100"
  //             required
  //           />
  //         </div>

  //         <div>
  //           <label className="block text-sm font-medium text-purple-300 mb-2">
  //             Мест в ряду
  //           </label>
  //           <input
  //             type="number"
  //             min="1"
  //             value={seatsPerRow}
  //             onChange={(e) => setSeatsPerRow(e.target.value)}
  //             className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 
  //               rounded-lg text-purple-100"
  //             required
  //           />
  //         </div>
  //       </>
  //     )}

  //     <div className="flex gap-4 pt-4">
  //       <button
  //         type="submit"
  //         disabled={createTheaterMutation.isPending}
  //         className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
  //           font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
  //           transition-all duration-300 active:scale-95 hover:scale-[1.02]
  //           disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  //       >
  //         <Plus size={18} />
  //       <span>Добавить</span>
  //       </button>
  //     </div>
  //   </form>
  // );
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
        onChange={(e) => setType(e.target.value as TheaterType)}
        className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 
            rounded-lg text-purple-100"
        required
      >
        <option value="REGULAR">Обычный</option>
        <option value="VIP">VIP</option>
        <option value="FLEXIBLE">Кастомная рассадка</option>
      </select>
    </div>

    {(type === "REGULAR" || type === "VIP") && (
      <>
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Количество рядов
          </label>
          <input
            type="number"
            min={1}
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
            min={1}
            value={seatsPerRow}
            onChange={(e) => setSeatsPerRow(e.target.value)}
            className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 
                rounded-lg text-purple-100"
            required
          />
        </div>
      </>
    )}

    {type === "FLEXIBLE" && (
      <div>
        <label className="block text-sm font-medium text-purple-300 mb-2">
          Ряды с количеством мест
        </label>

        {customRows.map((row, idx) => (
          <div key={idx} className="flex gap-4 mb-4 items-end">
            <div className="flex flex-col">
              <label
                className="text-xs text-purple-300 mb-1"
                htmlFor={`row-number-${idx}`}
              >
                Номер ряда
              </label>
              <input
                id={`row-number-${idx}`}
                type="number"
                min={1}
                value={row.number}
                onChange={(e) =>
                  updateCustomRow(idx, "number", Number(e.target.value))
                }
                className="w-24 px-2 py-1 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-100"
                placeholder="Номер ряда"
              />
            </div>

            <div className="flex flex-col">
              <label
                className="text-xs text-purple-300 mb-1"
                htmlFor={`row-seats-${idx}`}
              >
                Мест в ряду
              </label>
              <input
                id={`row-seats-${idx}`}
                type="number"
                min={1}
                value={row.seats}
                onChange={(e) =>
                  updateCustomRow(idx, "seats", Number(e.target.value))
                }
                className="w-28 px-2 py-1 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-100"
                placeholder="Мест"
              />
            </div>

            <button
              type="button"
              onClick={() => removeCustomRow(idx)}
              className="text-pink-500 hover:text-pink-600 mt-auto"
              aria-label="Удалить ряд"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addCustomRow}
          className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-purple-700 rounded-lg text-white hover:bg-purple-600"
        >
          <PlusCircle size={18} />
          Добавить ряд
        </button>
      </div>
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
