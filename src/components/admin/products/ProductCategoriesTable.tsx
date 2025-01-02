import { useState, useMemo } from 'react';
import { useProductCategories } from '../../../hooks/useProductCategories';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import { AddProductCategoryForm } from './AddProductCategoryForm';
import { TableControls } from '../TableControls';
import { Pagination } from '../Pagination';

export function ProductCategoriesTable() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    categoriesQuery,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  } = useProductCategories();

  const filteredAndPaginatedData = useMemo(() => {
    if (!categoriesQuery.data)
      return { categories: [], totalPages: 0, totalItems: 0 };

    const filtered = categoriesQuery.data.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const categories = filtered.slice(start, start + itemsPerPage);

    return { categories, totalPages, totalItems: filtered.length };
  }, [categoriesQuery.data, searchQuery, currentPage, itemsPerPage]);

  if (categoriesQuery.isLoading) {
    return <div className="text-purple-200">Загрузка...</div>;
  }

  if (categoriesQuery.isError) {
    return <div className="text-red-400">Ошибка загрузки данных</div>;
  }

  return (
    <div className="space-y-6">
      <AddProductCategoryForm
        onAdd={(name) => createCategoryMutation.mutate(name)}
        isLoading={createCategoryMutation.isPending}
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
          <table className="w-full">
            <thead>
              <tr className="bg-purple-900/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                  Название
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-purple-200">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {filteredAndPaginatedData.categories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-purple-900/20 transition-colors"
                >
                  <td className="px-6 py-4 text-purple-300">{category.id}</td>
                  <td className="px-6 py-4">
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500"
                      />
                    ) : (
                      <span className="text-purple-200">{category.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {editingId === category.id ? (
                        <>
                          <button
                            onClick={() => {
                              if (editingName.trim()) {
                                updateCategoryMutation.mutate({
                                  id: category.id,
                                  name: editingName,
                                });
                                setEditingId(null);
                              }
                            }}
                            className="p-2 bg-green-600/80 rounded-lg text-white 
                              hover:bg-green-500 transition-colors flex items-center gap-1"
                          >
                            <Save size={16} />
                            <span className="hidden md:inline">Сохранить</span>
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 bg-gray-600/80 rounded-lg text-white 
                              hover:bg-gray-500 transition-colors flex items-center gap-1"
                          >
                            <X size={16} />
                            <span className="hidden md:inline">Отмена</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(category.id);
                              setEditingName(category.name);
                            }}
                            className="p-2 bg-yellow-600/80 rounded-lg text-white 
                              hover:bg-yellow-500 transition-colors flex items-center gap-1"
                          >
                            <Pencil size={16} />
                            <span className="hidden md:inline">Изменить</span>
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Вы уверены, что хотите удалить эту категорию?'
                                )
                              ) {
                                deleteCategoryMutation.mutate(category.id);
                              }
                            }}
                            className="p-2 bg-red-600/80 rounded-lg text-white 
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
        totalPages={filteredAndPaginatedData.totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredAndPaginatedData.totalItems}
        onPageChange={setCurrentPage}
      />

      {(createCategoryMutation.isPending ||
        updateCategoryMutation.isPending ||
        deleteCategoryMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-purple-900/90 text-purple-200 px-4 py-2 rounded-lg shadow-lg">
          Сохранение изменений...
        </div>
      )}
    </div>
  );
}
