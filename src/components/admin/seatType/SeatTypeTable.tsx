import { useState, useMemo } from "react";
import { Pencil, Trash2, Save } from "lucide-react";
import { AddSeatTypeForm } from "./AddSeatType";
import { TableControls } from "../TableControls";
import { Pagination } from "../Pagination";
import { useSeatTypes } from "../../../hooks/useSeatTypes";

export function SeatTypeTable() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingSeatTypeName, setEditingSeatTypeName] = useState("");
  const [editingSeatTypeColor, setEditingSeatTypeColor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    seatTypesQuery,
    createSeatTypeMutation,
    updateSeatTypeMutation,
    deleteSeatTypeMutation,
  } = useSeatTypes();

  const filteredAndPaginatedData = useMemo(() => {
    if (!seatTypesQuery.data)
      return { seatTypes: [], totalPages: 0, totalItems: 0 };

    const filtered = seatTypesQuery.data.filter((seat) =>
      seat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const seatTypes = filtered.slice(start, start + itemsPerPage);

    return { seatTypes, totalPages, totalItems: filtered.length };
  }, [seatTypesQuery.data, searchQuery, currentPage, itemsPerPage]);

  if (seatTypesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-purple-400">Загрузка...</div>
      </div>
    );
  }

  if (seatTypesQuery.isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Ошибка загрузки данных</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <AddSeatTypeForm
        onAdd={(name, color) => createSeatTypeMutation.mutate({ name, color })}
        isLoading={createSeatTypeMutation.isPending}
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
                  Цвет
                </th>
                <th className="px-3 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-purple-200">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {filteredAndPaginatedData.seatTypes.map((seat) => (
                <tr
                  key={seat.id}
                  className="hover:bg-purple-900/20 transition-colors"
                >
                  <td className="px-3 md:px-6 py-3 md:py-4 text-purple-300 text-sm">
                    {seat.id}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === seat.id ? (
                      <input
                        type="text"
                        value={editingSeatTypeName}
                        onChange={(e) => setEditingSeatTypeName(e.target.value)}
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <span className="text-purple-200 text-sm">
                        {seat.name}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === seat.id ? (
                      <input
                        type="color"
                        value={editingSeatTypeColor}
                        onChange={(e) =>
                          setEditingSeatTypeColor(e.target.value)
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <input
                        type="color"
                        value={seat.color}
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
                        readOnly
                        onClick={(e) => e.preventDefault()} // блокируем открытие
                      />
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                    <div className="flex justify-end gap-1 md:gap-2">
                      {editingId === seat.id ? (
                        <button
                          onClick={() => {
                            if (editingSeatTypeName.trim()) {
                              updateSeatTypeMutation.mutate({
                                id: seat.id,
                                name: editingSeatTypeName,
                                color: editingSeatTypeColor,
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
                            setEditingId(seat.id);
                            setEditingSeatTypeName(seat.name);
                            setEditingSeatTypeColor(seat.color as string);
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
                              "Вы уверены, что хотите удалить этот жанр?"
                            )
                          ) {
                            deleteSeatTypeMutation.mutate(seat.id);
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

      {(createSeatTypeMutation.isPending ||
        updateSeatTypeMutation.isPending ||
        deleteSeatTypeMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-purple-900/90 text-purple-200 px-4 py-2 rounded-lg shadow-lg">
          Сохранение изменений...
        </div>
      )}
    </div>
  );
}
