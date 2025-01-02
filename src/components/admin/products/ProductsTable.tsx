import { useState, useMemo } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import { useProductCategories } from '../../../hooks/useProductCategories';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import { AddProductForm } from './AddProductForm';
import { TableControls } from '../TableControls';
import { Pagination } from '../Pagination';
import { formatPrice } from '../../../utils/formatters';
import { baseURL } from '../../../api/axios';

export function ProductsTable() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({
    name: '',
    price: '',
    categoryId: '',
    additionalInfo: '',
    image: null as File | null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    productsQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  } = useProducts();

  const { categoriesQuery } = useProductCategories();

  const filteredAndPaginatedData = useMemo(() => {
    if (!productsQuery.data)
      return { products: [], totalPages: 0, totalItems: 0 };

    const filtered = productsQuery.data.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const products = filtered.slice(start, start + itemsPerPage);

    return { products, totalPages, totalItems: filtered.length };
  }, [productsQuery.data, searchQuery, currentPage, itemsPerPage]);

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setEditingData({
      name: product.name,
      price: product.price.toString(),
      categoryId: product.categoryId.toString(),
      additionalInfo: product.additionalInfo || '',
      image: null,
    });
  };

  const handleUpdate = (productId: number) => {
    const formData = new FormData();
    formData.append('name', editingData.name);
    formData.append('price', editingData.price);
    formData.append('categoryId', editingData.categoryId);
    formData.append('additionalInfo', editingData.additionalInfo);
    if (editingData.image) {
      formData.append('image', editingData.image);
    }

    updateProductMutation.mutate({ id: productId, formData });
    setEditingId(null);
  };

  if (productsQuery.isLoading || categoriesQuery.isLoading) {
    return <div className="text-purple-200">Загрузка...</div>;
  }

  if (productsQuery.isError || categoriesQuery.isError) {
    return <div className="text-red-400">Ошибка загрузки данных</div>;
  }

  return (
    <div className="space-y-6">
      <AddProductForm
        onAdd={(formData) => createProductMutation.mutate(formData)}
        isLoading={createProductMutation.isPending}
        categories={categoriesQuery.data || []}
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

      {/* Мобильное представление */}
      <div className="md:hidden space-y-4">
        {filteredAndPaginatedData.products.map((product) => (
          <div key={product.id} className="bg-purple-950/50 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-16 h-16 relative group">
                    <img
                      src={`${baseURL}/${product.imagePath}`}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {editingId === product.id && (
                      <div
                        className="absolute inset-0 flex items-center justify-center 
                        bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                      >
                        <label className="cursor-pointer w-full h-full flex items-center justify-center">
                          <input
                            type="file"
                            onChange={(e) =>
                              setEditingData({
                                ...editingData,
                                image: e.target.files?.[0] || null,
                              })
                            }
                            accept="image/*"
                            className="hidden"
                          />
                          <span className="text-white text-xs text-center px-2">
                            Нажмите для изменения
                          </span>
                        </label>
                      </div>
                    )}
                    {editingId === product.id && editingData.image && (
                      <div className="absolute inset-0">
                        <img
                          src={URL.createObjectURL(editingData.image)}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-200">
                      {product.name}
                    </h3>
                    <p className="text-sm text-purple-300">
                      {product.category.name}
                    </p>
                  </div>
                </div>
                <p className="text-purple-200 font-medium">
                  {formatPrice(product.price)} ₽
                </p>
                {product.additionalInfo && (
                  <p className="text-sm text-purple-400 mt-2">
                    {product.additionalInfo}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-yellow-600/80 rounded-lg text-white 
                    hover:bg-yellow-500 transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        'Вы уверены, что хотите удалить этот товар?'
                      )
                    ) {
                      deleteProductMutation.mutate(product.id);
                    }
                  }}
                  className="p-2 bg-red-600/80 rounded-lg text-white 
                    hover:bg-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Десктопное представление */}
      <div className="hidden md:block bg-purple-950/50 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-900/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                  Изображение
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                  Название
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                  Категория
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                  Цена
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-purple-200">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {filteredAndPaginatedData.products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-purple-900/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="w-16 h-24 relative group">
                      <img
                        src={`${baseURL}/${product.imagePath}`}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {editingId === product.id && (
                        <div
                          className="absolute inset-0 flex items-center justify-center 
                          bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                        >
                          <label className="cursor-pointer w-full h-full flex items-center justify-center">
                            <input
                              type="file"
                              onChange={(e) =>
                                setEditingData({
                                  ...editingData,
                                  image: e.target.files?.[0] || null,
                                })
                              }
                              accept="image/*"
                              className="hidden"
                            />
                            <span className="text-white text-xs text-center px-2">
                              Нажмите для изменения
                            </span>
                          </label>
                        </div>
                      )}
                      {editingId === product.id && editingData.image && (
                        <div className="absolute inset-0">
                          <img
                            src={URL.createObjectURL(editingData.image)}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === product.id ? (
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
                          text-purple-200 focus:outline-none focus:border-purple-500"
                      />
                    ) : (
                      <span className="text-purple-200">{product.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === product.id ? (
                      <select
                        value={editingData.categoryId}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            categoryId: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500"
                      >
                        {categoriesQuery.data?.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-purple-200">
                        {product.category.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={editingData.price}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            price: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500"
                      />
                    ) : (
                      <span className="text-purple-200">
                        {formatPrice(product.price)} ₽
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {editingId === product.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(product.id)}
                            className="p-2 bg-green-600/80 rounded-lg text-white 
                              hover:bg-green-500 transition-colors flex items-center gap-1"
                          >
                            <Save size={16} />
                            <span>Сохранить</span>
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 bg-gray-600/80 rounded-lg text-white 
                              hover:bg-gray-500 transition-colors flex items-center gap-1"
                          >
                            <X size={16} />
                            <span>Отмена</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 bg-yellow-600/80 rounded-lg text-white 
                              hover:bg-yellow-500 transition-colors flex items-center gap-1"
                          >
                            <Pencil size={16} />
                            <span>Изменить</span>
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Вы уверены, что хотите удалить этот товар?'
                                )
                              ) {
                                deleteProductMutation.mutate(product.id);
                              }
                            }}
                            className="p-2 bg-red-600/80 rounded-lg text-white 
                              hover:bg-red-500 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            <span>Удалить</span>
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

      {(createProductMutation.isPending ||
        updateProductMutation.isPending ||
        deleteProductMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-purple-900/90 text-purple-200 px-4 py-2 rounded-lg shadow-lg">
          Сохранение изменений...
        </div>
      )}
    </div>
  );
}
