// import { useState } from 'react';
// import { useTheaters } from '../../../hooks/useTheaters';
// import { Plus, PlusCircle, Trash2 } from 'lucide-react';
// import { Row, TheaterType } from '../../../types/theater';

// export function AddTheaterForm() {
//   const [name, setName] = useState('');
//   const [type, setType] = useState<TheaterType>('REGULAR');
//   const [rows, setRows] = useState('');
//   const [seatsPerRow, setSeatsPerRow] = useState('');

//    // Для кастомных рядов:
//   const [customRows, setCustomRows] = useState<Row[]>([]);

//   const { createTheaterMutation } = useTheaters();

//    // Добавить новый пустой ряд
//   const addCustomRow = () => {
//     setCustomRows([...customRows, { number: customRows.length + 1, seats: 1 }]);
//   };

//   // Удалить ряд по индексу
//   const removeCustomRow = (index: number) => {
//     const newRows = customRows.filter((_, i) => i !== index);
//     // Переиндексация номеров рядов:
//     setCustomRows(newRows.map((r, i) => ({ ...r, number: i + 1 })));
//   };

//   // Изменить значение ряда
//   const updateCustomRow = (index: number, field: 'number' | 'seats', value: number) => {
//     const newRows = [...customRows];
//     newRows[index] = { ...newRows[index], [field]: value };
//     setCustomRows(newRows);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (type === 'FLEXIBLE') {
//       if (customRows.length === 0) {
//         alert('Добавьте хотя бы один ряд для кастомного типа');
//         return;
//       }
//       createTheaterMutation.mutate({
//         name,
//         type,
//         rowLayout: customRows,
//         rows: undefined,
//         seatsPerRow: undefined,
//       });
//     } else {
//       createTheaterMutation.mutate({
//         name,
//         type,
//         rows: Number(rows),
//         seatsPerRow: Number(seatsPerRow),
//         rowLayout: undefined,
//       });
//     }
//   };

 
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
//             rounded-lg text-purple-100 placeholder-purple-400"
//         required
//       />
//     </div>

//     <div>
//       <label className="block text-sm font-medium text-purple-300 mb-2">
//         Тип зала
//       </label>
//       <select
//         value={type}
//         onChange={(e) => setType(e.target.value as TheaterType)}
//         className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 
//             rounded-lg text-purple-100"
//         required
//       >
//         <option value="REGULAR">Обычный</option>
//         <option value="VIP">VIP</option>
//         <option value="FLEXIBLE">Кастомная рассадка</option>
//       </select>
//     </div>

//     {(type === "REGULAR" || type === "VIP") && (
//       <>
//         <div>
//           <label className="block text-sm font-medium text-purple-300 mb-2">
//             Количество рядов
//           </label>
//           <input
//             type="number"
//             min={1}
//             value={rows}
//             onChange={(e) => setRows(e.target.value)}
//             className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 
//                 rounded-lg text-purple-100"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-purple-300 mb-2">
//             Мест в ряду
//           </label>
//           <input
//             type="number"
//             min={1}
//             value={seatsPerRow}
//             onChange={(e) => setSeatsPerRow(e.target.value)}
//             className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 
//                 rounded-lg text-purple-100"
//             required
//           />
//         </div>
//       </>
//     )}

//     {type === "FLEXIBLE" && (
//       <div>
//         <label className="block text-sm font-medium text-purple-300 mb-2">
//           Ряды с количеством мест
//         </label>

//         {customRows.map((row, idx) => (
//           <div key={idx} className="flex gap-4 mb-4 items-end">
//             <div className="flex flex-col">
//               <label
//                 className="text-xs text-purple-300 mb-1"
//                 htmlFor={`row-number-${idx}`}
//               >
//                 Номер ряда
//               </label>
//               <input
//                 id={`row-number-${idx}`}
//                 type="number"
//                 min={1}
//                 value={row.number}
//                 onChange={(e) =>
//                   updateCustomRow(idx, "number", Number(e.target.value))
//                 }
//                 className="w-24 px-2 py-1 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-100"
//                 placeholder="Номер ряда"
//               />
//             </div>

//             <div className="flex flex-col">
//               <label
//                 className="text-xs text-purple-300 mb-1"
//                 htmlFor={`row-seats-${idx}`}
//               >
//                 Мест в ряду
//               </label>
//               <input
//                 id={`row-seats-${idx}`}
//                 type="number"
//                 min={1}
//                 value={row.seats}
//                 onChange={(e) =>
//                   updateCustomRow(idx, "seats", Number(e.target.value))
//                 }
//                 className="w-28 px-2 py-1 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-100"
//                 placeholder="Мест"
//               />
//             </div>

//             <button
//               type="button"
//               onClick={() => removeCustomRow(idx)}
//               className="text-pink-500 hover:text-pink-600 mt-auto"
//               aria-label="Удалить ряд"
//             >
//               <Trash2 size={20} />
//             </button>
//           </div>
//         ))}

//         <button
//           type="button"
//           onClick={addCustomRow}
//           className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-purple-700 rounded-lg text-white hover:bg-purple-600"
//         >
//           <PlusCircle size={18} />
//           Добавить ряд
//         </button>
//       </div>
//     )}

//     <div className="flex gap-4 pt-4">
//       <button
//         type="submit"
//         disabled={createTheaterMutation.isPending}
//         className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
//             font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
//             transition-all duration-300 active:scale-95 hover:scale-[1.02]
//             disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//       >
//         <Plus size={18} />
//         <span>Добавить</span>
//       </button>
//     </div>
//   </form>
// );

// }


import { useState } from 'react';
import { useTheaters } from '../../../hooks/useTheaters';
import { useSeatTypes } from '../../../hooks/useSeatTypes';
import { Plus, PlusCircle, Trash2 } from 'lucide-react';
import { Row, Seat, SeatType, TheaterType } from '../../../types/theater';

export function AddTheaterForm() {
  const [name, setName] = useState('');
  const [type, setType] = useState<TheaterType>('REGULAR');
  const [rows, setRows] = useState('');
  const [seatsPerRow, setSeatsPerRow] = useState('');
  const [customRows, setCustomRows] = useState<Row[]>([]);

  const { createTheaterMutation } = useTheaters();
  const { seatTypesQuery } = useSeatTypes();

  const seatTypes = seatTypesQuery.data || [];

  const addCustomRow = () => {
    setCustomRows([
      ...customRows,
      {
        number: customRows.length + 1,
        seats: [{ number: 1, seatTypeId: seatTypes[0]?.id || 1, seatType: seatTypes[0] }]
      }
    ]);
  };

  const removeCustomRow = (index: number) => {
    const newRows = customRows.filter((_, i) => i !== index);
    setCustomRows(newRows.map((r, i) => ({ ...r, number: i + 1 })));
  };

  const updateSeat = (rowIdx: number, seatIdx: number, field: 'number' | 'seatTypeId', value: number) => {
    const updatedRows = [...customRows];
    const updatedSeat = { ...updatedRows[rowIdx].seats[seatIdx] };

    if (field === 'number') {
      updatedSeat.number = value;
    } else if (field === 'seatTypeId') {
      const selectedType = seatTypes.find((st) => st.id === value);
      updatedSeat.seatTypeId = value;
      updatedSeat.seatType = selectedType as SeatType;
    }

    updatedRows[rowIdx].seats[seatIdx] = updatedSeat;
    setCustomRows(updatedRows);
  };

  const addSeatToRow = (rowIdx: number) => {
    const updatedRows = [...customRows];
    const newSeat: Seat = {
      number: updatedRows[rowIdx].seats.length + 1,
      seatTypeId: seatTypes[0]?.id || 1,
      seatType: seatTypes[0],
    };
    updatedRows[rowIdx].seats.push(newSeat);
    setCustomRows(updatedRows);
  };

  const removeSeatFromRow = (rowIdx: number, seatIdx: number) => {
    const updatedRows = [...customRows];
    updatedRows[rowIdx].seats = updatedRows[rowIdx].seats.filter((_, i) => i !== seatIdx);
    updatedRows[rowIdx].seats = updatedRows[rowIdx].seats.map((s, i) => ({ ...s, number: i + 1 }));
    setCustomRows(updatedRows);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'FLEXIBLE') {
      if (customRows.length === 0) {
        alert('Добавьте хотя бы один ряд для кастомного типа');
        return;
      }

      const payload = customRows.map((row) => ({
        number: row.number,
        seats: row.seats.map((seat) => ({
          number: seat.number,
          seatTypeId: seat.seatTypeId!,
        })),
      }));

      createTheaterMutation.mutate({
        name,
        type,
        rows: undefined,
        seatsPerRow: undefined,
        rowLayout: payload as any,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Название и тип */}
      <div>
        <label className="block mb-2 text-sm font-medium text-purple-300">Название зала</label>
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
        <label className="block mb-2 text-sm font-medium text-purple-300">Тип зала</label>
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

      {(type === 'REGULAR' || type === 'VIP') && (
        <>
          <div>
            <label className="block mb-2 text-sm font-medium text-purple-300">Количество рядов</label>
            <input
              type="number"
              min={1}
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-100"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-purple-300">Мест в ряду</label>
            <input
              type="number"
              min={1}
              value={seatsPerRow}
              onChange={(e) => setSeatsPerRow(e.target.value)}
              className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-100"
              required
            />
          </div>
        </>
      )}

      {type === 'FLEXIBLE' && (
        <div>
          <label className="block mb-3 text-sm font-medium text-purple-300">Кастомные ряды</label>

          {customRows.map((row, rowIdx) => (
            <div key={rowIdx} className="mb-4 space-y-2 border-b pb-4">
              <div className="flex justify-between items-center">
                <span className="text-purple-200 font-medium">Ряд {row.number}</span>
                <button
                  type="button"
                  onClick={() => removeCustomRow(rowIdx)}
                  className="text-pink-500 hover:text-pink-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-2">
                {row.seats.map((seat, seatIdx) => (
                  <div key={seatIdx} className="flex gap-2 items-center">
                    <input
                      type="number"
                      min={1}
                      value={seat.number}
                      onChange={(e) =>
                        updateSeat(rowIdx, seatIdx, 'number', Number(e.target.value))
                      }
                      className="w-20 px-2 py-1 bg-purple-800 border border-purple-600 rounded text-purple-100"
                    />

                    <select
                      value={seat.seatTypeId}
                      onChange={(e) =>
                        updateSeat(rowIdx, seatIdx, 'seatTypeId', Number(e.target.value))
                      }
                      className="px-3 py-1 bg-purple-800 border border-purple-600 rounded text-purple-100"
                    >
                      {seatTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => removeSeatFromRow(rowIdx, seatIdx)}
                      className="text-pink-500 hover:text-pink-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addSeatToRow(rowIdx)}
                  className="text-sm text-purple-300 hover:text-purple-200 mt-1"
                >
                  + Добавить место
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCustomRow}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 rounded-lg text-white hover:bg-purple-600"
          >
            <PlusCircle size={18} />
            Добавить ряд
          </button>
        </div>
      )}

      <div className="pt-4">
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
