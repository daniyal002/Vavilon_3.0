import { useState, useMemo } from 'react';
import { usePromoCodes } from '../../../hooks/usePromoCodes';
import { AddPromoCodeForm } from './AddPromoCodeForm';
import { TableControls } from '../TableControls';
import { Pagination } from '../Pagination';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useProducts } from '../../../hooks/useProducts';

export function PromoCodesTable() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({
    code: '',
    type: '',
    value: '',
    productId: '',
    startDate: '',
    endDate: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    promoCodesQuery,
    createPromoCodeMutation,
    updatePromoCodeMutation,
    deletePromoCodeMutation,
  } = usePromoCodes();

  const { data: promoCodeData, isLoading, isError } = promoCodesQuery();

  const filteredAndPaginatedData = useMemo(() => {
    if (!promoCodeData) return { promoCodes: [], totalPages: 0, totalItems: 0 };

    const filtered = promoCodeData.filter(
      (promoCode) =>
        promoCode.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promoCode.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const promoCodes = filtered.slice(start, start + itemsPerPage);

    return {
      promoCodes,
      totalPages,
      totalItems: filtered.length,
    };
  }, [promoCodeData, searchQuery, currentPage, itemsPerPage]);

  const { productsQuery } = useProducts();
  const { data: productstData } = productsQuery;

  const handleEdit = (promoCode: any) => {
    setEditingId(promoCode.id);
    setEditingData({
      code: promoCode.code,
      type: promoCode.type,
      value: promoCode.value?.toString() || '',
      productId: promoCode.productId?.toString() || '',
      startDate: format(new Date(promoCode.startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(promoCode.endDate), 'yyyy-MM-dd'),
    });
  };

  const handleUpdate = (promoCodeId: number) => {
    const updatedData = {
      id: promoCodeId,
      ...editingData,
      value: editingData.value ? parseFloat(editingData.value) : null,
      productId: editingData.productId ? parseInt(editingData.productId) : null,
    };

    updatePromoCodeMutation.mutate(updatedData);
    setEditingId(null);
  };

  if (isLoading) {
    return <div className="text-purple-200">Загрузка...</div>;
  }

  if (isError) {
    return <div className="text-red-400">Ошибка загрузки данных</div>;
  }

  return (
    <div className="space-y-6">
      <AddPromoCodeForm
        onAdd={createPromoCodeMutation.mutate}
        isLoading={createPromoCodeMutation.isPending}
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
        {filteredAndPaginatedData.promoCodes.map((promoCode) => (
          <div
            key={promoCode.id}
            className="bg-purple-950/50 rounded-xl p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-purple-200 font-semibold">
                  {promoCode.code}
                </h3>
                <p className="text-purple-300 text-sm">{promoCode.type}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(promoCode)}
                  className="p-2 bg-yellow-600/80 rounded-lg text-white hover:bg-yellow-500 transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        'Вы уверены, что хотите удалить этот промокод?'
                      )
                    ) {
                      deletePromoCodeMutation.mutate(promoCode.id);
                    }
                  }}
                  className="p-2 bg-red-600/80 rounded-lg text-white hover:bg-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="text-purple-400">Значение:</div>
              <div className="text-purple-200">{promoCode.value}</div>
              <div className="text-purple-400">Начало:</div>
              <div className="text-purple-200">
                {format(new Date(promoCode.startDate), 'dd.MM.yyyy')}
              </div>
              <div className="text-purple-400">Конец:</div>
              <div className="text-purple-200">
                {format(new Date(promoCode.endDate), 'dd.MM.yyyy')}
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200">
                  Код
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200">
                  Тип
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200">
                  Значение
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200">
                  Товар
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200">
                  Дата начала
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200">
                  Дата окончания
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-purple-200">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {filteredAndPaginatedData.promoCodes.map((promoCode) => (
                <tr key={promoCode.id} className="hover:bg-purple-900/20">
                  <td className="px-6 py-4 text-purple-200">
                    {editingId === promoCode.id ? (
                      <input
                        type="text"
                        value={editingData.code}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            code: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500"
                      />
                    ) : (
                      promoCode.code
                    )}
                  </td>
                  <td className="px-6 py-4 text-purple-200">
                    {editingId === promoCode.id ? (
                      <select
                      value={editingData.type}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          type: e.target.value,
                        })
                      }
                      className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                       text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                    >
                      <option value="PERCENTAGE">Процент</option>
                      <option value="FIXED">Фиксированная сумма</option>
                      <option value="PRODUCT">Товар</option>
                    </select>
                    ) : (
                      promoCode.type
                    )}
                  </td>
                  <td className="px-6 py-4 text-purple-200">
                    {editingId === promoCode.id ? (
                      <input
                        type="number"
                        value={editingData.value}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            value: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500"
                      />
                    ) : (
                      promoCode.value
                    )}
                  </td>
                  <td className="px-6 py-4 text-purple-200">
                    {editingId === promoCode.id ? (
                      <select
                        value={editingData.productId}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            productId: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      >
                        <option value="">-</option>
                        {productstData?.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      promoCode.product?.name || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-purple-200">
                    {editingId === promoCode.id ? (
                      <input
                        type="date"
                        value={editingData.startDate}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            startDate: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500"
                      />
                    ) : (
                      format(new Date(promoCode.startDate), 'dd.MM.yyyy')
                    )}
                  </td>
                  <td className="px-6 py-4 text-purple-200">
                    {editingId === promoCode.id ? (
                      <input
                        type="date"
                        value={editingData.endDate}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            endDate: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500"
                      />
                    ) : (
                      format(new Date(promoCode.endDate), 'dd.MM.yyyy')
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {editingId === promoCode.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(promoCode.id)}
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
                            onClick={() => handleEdit(promoCode)}
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
                                  'Вы уверены, что хотите удалить этот промокод?'
                                )
                              ) {
                                deletePromoCodeMutation.mutate(promoCode.id);
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

      {(createPromoCodeMutation.isPending ||
        updatePromoCodeMutation.isPending ||
        deletePromoCodeMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-purple-900/90 text-purple-200 px-4 py-2 rounded-lg shadow-lg">
          Сохранение изменений...
        </div>
      )}
    </div>
  );
}
