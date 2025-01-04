import { useState } from 'react';
import { useTheaters } from '../../../hooks/useTheaters';
import { TableControls } from '../TableControls';
import { Pagination } from '../Pagination';
import { Theater } from '../../../types/theater';
import { AddTheaterForm } from './AddTheaterForm';
import { Pencil, Save, Trash2, X } from 'lucide-react';

export function TheatersTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingTheater, setEditingTheater] = useState<Theater | null>(null);

  const { theatersQuery, updateTheaterMutation, deleteTheaterMutation } =
    useTheaters();

  if (theatersQuery.isLoading) {
    return <div className="text-purple-200">Загрузка...</div>;
  }

  if (theatersQuery.isError) {
    return <div className="text-red-400">Ошибка загрузки данных</div>;
  }

  const filteredTheaters =
    theatersQuery.data?.filter((theater) =>
      theater.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredTheaters.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedTheaters = filteredTheaters.slice(start, start + itemsPerPage);

  const handleSave = (theater: Theater) => {
    updateTheaterMutation.mutate(theater, {
      onSuccess: () => setEditingTheater(null),
    });
  };

  return (
    <div className="space-y-6">
        <div className="bg-purple-900/40 backdrop-blur-sm p-6 rounded-xl border border-purple-500/10">
          <AddTheaterForm />
        </div>
        <>
          <TableControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />

          <div className="bg-purple-950/50 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">
                      Название
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">
                      Тип
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">
                      Ряды
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">
                      Места в ряду
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">
                      Вместимость
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-purple-200">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-700/30">
                  {paginatedTheaters.map((theater) => (
                    <tr key={theater.id} className="hover:bg-purple-900/20">
                      <td className="px-6 py-4">
                        {editingTheater?.id === theater.id ? (
                          <input
                            type="text"
                            value={editingTheater.name}
                            onChange={(e) =>
                              setEditingTheater({
                                ...editingTheater,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 bg-purple-900/50 border border-purple-700/30 
                              rounded text-purple-100"
                          />
                        ) : (
                          <span className="text-purple-200">
                            {theater.name}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingTheater?.id === theater.id ? (
                          <select
                            value={editingTheater.type}
                            onChange={(e) =>
                              setEditingTheater({
                                ...editingTheater,
                                type: e.target.value as 'REGULAR' | 'VIP',
                              })
                            }
                            className="w-full px-2 py-1 bg-purple-900/50 border border-purple-700/30 
                              rounded text-purple-100"
                          >
                            <option value="REGULAR">Обычный</option>
                            <option value="VIP">VIP</option>
                          </select>
                        ) : (
                          <span className="text-purple-200">
                            {theater.type === 'VIP' ? 'VIP' : 'Обычный'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingTheater?.id === theater.id &&
                        editingTheater.type === 'VIP' ? (
                          <input
                            type="number"
                            min="1"
                            value={editingTheater.rows}
                            onChange={(e) =>
                              setEditingTheater({
                                ...editingTheater,
                                rows: Number(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 bg-purple-900/50 border border-purple-700/30 
                              rounded text-purple-100"
                          />
                        ) : (
                          <span className="text-purple-200">
                            {theater.rows}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingTheater?.id === theater.id &&
                        editingTheater.type === 'VIP' ? (
                          <input
                            type="number"
                            min="1"
                            value={editingTheater.seatsPerRow}
                            onChange={(e) =>
                              setEditingTheater({
                                ...editingTheater,
                                seatsPerRow: Number(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 bg-purple-900/50 border border-purple-700/30 
                              rounded text-purple-100"
                          />
                        ) : (
                          <span className="text-purple-200">
                            {theater.seatsPerRow}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-purple-200">
                        {theater.rows * theater.seatsPerRow}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                    <div className="flex justify-end gap-1 md:gap-2">
                      {editingTheater?.id === theater.id ? (
                        <>
                          <button
                            onClick={() => handleSave(editingTheater)}
                            className="p-1.5 md:p-2 bg-green-600/80 rounded-lg text-white 
                              hover:bg-green-500 transition-colors flex items-center gap-1"
                          >
                            <Save size={16} />
                            <span className="hidden md:inline">Сохранить</span>
                          </button>
                          <button
                            onClick={() => setEditingTheater(null)}
                            className="p-1.5 md:p-2 bg-gray-600/80 rounded-lg text-white 
                              hover:bg-gray-500 transition-colors flex items-center gap-1"
                          >
                            <X size={16} />
                            <span className="hidden md:inline">Отмена</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingTheater(theater)}
                            className="p-1.5 md:p-2 bg-yellow-600/80 rounded-lg text-white 
                              hover:bg-yellow-500 transition-colors flex items-center gap-1"
                          >
                            <Pencil size={16} />
                            <span className="hidden md:inline">Изменить</span>
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Вы уверены, что хотите удалить этот фильм?'
                                )
                              ) {
                                deleteTheaterMutation.mutate(theater.id as number);
                              }
                            }}
                            className="p-1.5 md:p-2 bg-red-600/80 rounded-lg text-white 
                              hover:bg-red-500 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            <span className="hidden md:inline">Удалить</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredTheaters.length}
            onPageChange={setCurrentPage}
          />
        </>
    </div>
  );
}
