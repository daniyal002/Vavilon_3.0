import { useState, useMemo } from 'react';
import { useGenres } from '../../../hooks/useGenres';
import { Pencil, Trash2, Save } from 'lucide-react';
import { AddGenreForm } from './AddGenreForm';
import { TableControls } from '../TableControls';
import { Pagination } from '../Pagination';

export function GenresTable() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    genresQuery,
    createGenreMutation,
    updateGenreMutation,
    deleteGenreMutation,
  } = useGenres();

  const filteredAndPaginatedData = useMemo(() => {
    if (!genresQuery.data) return { genres: [], totalPages: 0, totalItems: 0 };

    const filtered = genresQuery.data.filter((genre) =>
      genre.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const genres = filtered.slice(start, start + itemsPerPage);

    return { genres, totalPages, totalItems: filtered.length };
  }, [genresQuery.data, searchQuery, currentPage, itemsPerPage]);

  if (genresQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-purple-400">Загрузка...</div>
      </div>
    );
  }

  if (genresQuery.isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Ошибка загрузки данных</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <AddGenreForm
        onAdd={(name) => createGenreMutation.mutate(name)}
        isLoading={createGenreMutation.isPending}
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
                <th className="px-3 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-purple-200">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {filteredAndPaginatedData.genres.map((genre) => (
                <tr
                  key={genre.id}
                  className="hover:bg-purple-900/20 transition-colors"
                >
                  <td className="px-3 md:px-6 py-3 md:py-4 text-purple-300 text-sm">
                    {genre.id}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === genre.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {genre.name}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                    <div className="flex justify-end gap-1 md:gap-2">
                      {editingId === genre.id ? (
                        <button
                          onClick={() => {
                            if (editingName.trim()) {
                              updateGenreMutation.mutate({
                                id: genre.id,
                                name: editingName,
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
                            setEditingId(genre.id);
                            setEditingName(genre.name);
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
                              'Вы уверены, что хотите удалить этот жанр?'
                            )
                          ) {
                            deleteGenreMutation.mutate(genre.id);
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

      {(createGenreMutation.isPending ||
        updateGenreMutation.isPending ||
        deleteGenreMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-purple-900/90 text-purple-200 px-4 py-2 rounded-lg shadow-lg">
          Сохранение изменений...
        </div>
      )}
    </div>
  );
}
