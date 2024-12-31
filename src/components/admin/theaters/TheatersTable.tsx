import { useMemo, useState } from 'react';
import { useTheaters } from '../../../hooks/useTheaters';
import { AddTheaterForm } from './AddTheaterForm';
import { TableControls } from '../TableControls';
import { Pagination } from '../Pagination';
import { Pencil, Trash2, Save } from 'lucide-react';

export function TheatersTable() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({
    name: '',
    location: '',
    capacity: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    theatersQuery,
    createTheaterMutation,
    updateTheaterMutation,
    deleteTheaterMutation,
  } = useTheaters();

  const filteredAndPaginatedData = useMemo(() => {
    if (!theatersQuery.data)
      return { theaters: [], totalPages: 0, totalItems: 0 };

    const filtered = theatersQuery.data.filter(
      (theater) =>
        theater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theater.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const theaters = filtered.slice(start, start + itemsPerPage);

    return { theaters, totalPages, totalItems: filtered.length };
  }, [theatersQuery.data, searchQuery, currentPage, itemsPerPage]);

  if (theatersQuery.isLoading) {
    return <div className="text-purple-200">Загрузка...</div>;
  }

  if (theatersQuery.isError) {
    return <div className="text-red-400">Ошибка загрузки данных</div>;
  }

  return (
    <div className="space-y-6">
      <AddTheaterForm
        onAdd={createTheaterMutation.mutate}
        isLoading={createTheaterMutation.isPending}
      />

      <TableControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
      />

      <div className="bg-purple-950/50 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-purple-900/50">
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  ID
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Название
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Расположение
                </th>
                <th className="px-3 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-200">
                  Вместимость
                </th>
                <th className="px-3 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-purple-200">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {filteredAndPaginatedData.theaters.map((theater) => (
                <tr
                  key={theater.id}
                  className="hover:bg-purple-900/20 transition-colors"
                >
                  <td className="px-3 md:px-6 py-3 md:py-4 text-purple-300 text-sm">
                    {theater.id}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === theater.id ? (
                      <input
                        type="text"
                        value={editingData.name}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            name: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {theater.name}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === theater.id ? (
                      <input
                        type="text"
                        value={editingData.location}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            location: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {theater.location || '-'}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === theater.id ? (
                      <input
                        type="number"
                        value={editingData.capacity}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            capacity: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {theater.capacity || '-'}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                    <div className="flex justify-end gap-1 md:gap-2">
                      {editingId === theater.id ? (
                        <button
                          onClick={() => {
                            if (editingData.name.trim()) {
                              updateTheaterMutation.mutate({
                                id: theater.id,
                                name: editingData.name,
                                location: editingData.location || undefined,
                                capacity: editingData.capacity
                                  ? parseInt(editingData.capacity)
                                  : undefined,
                              });
                              setEditingId(null);
                            }
                          }}
                          className="p-1.5 md:p-2 bg-green-600/80 rounded-lg text-white 
                            hover:bg-green-500 transition-colors flex items-center gap-1"
                        >
                          <Save size={16} />
                          <span className="hidden md:inline">Сохранить</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(theater.id);
                            setEditingData({
                              name: theater.name,
                              location: theater.location || '',
                              capacity: theater.capacity?.toString() || '',
                            });
                          }}
                          className="p-1.5 md:p-2 bg-yellow-600/80 rounded-lg text-white 
                            hover:bg-yellow-500 transition-colors flex items-center gap-1"
                        >
                          <Pencil size={16} />
                          <span className="hidden md:inline">Изменить</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              'Вы уверены, что хотите удалить этот зал?'
                            )
                          ) {
                            deleteTheaterMutation.mutate(theater.id);
                          }
                        }}
                        className="p-1.5 md:p-2 bg-red-600/80 rounded-lg text-white 
                          hover:bg-red-500 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        <span className="hidden md:inline">Удалить</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={filteredAndPaginatedData.totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndPaginatedData.totalItems}
          onPageChange={setCurrentPage}
        />
      </div>

      {(createTheaterMutation.isPending ||
        updateTheaterMutation.isPending ||
        deleteTheaterMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-purple-900/90 text-purple-200 px-4 py-2 rounded-lg shadow-lg">
          Сохранение изменений...
        </div>
      )}
    </div>
  );
}
