import { useState, useMemo } from 'react';
import { useUserRoles } from '../../../hooks/useUserRoles';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import { AddUserRoleForm } from './AddUserRoleForm';
import { TableControls } from '../TableControls';
import { Pagination } from '../Pagination';

export function UserRolesTable() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    rolesQuery,
    createRoleMutation,
    updateRoleMutation,
    deleteRoleMutation,
  } = useUserRoles();

  const filteredAndPaginatedData = useMemo(() => {
    if (!rolesQuery.data) return { roles: [], totalPages: 0, totalItems: 0 };

    const filtered = rolesQuery.data.filter((role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const roles = filtered.slice(start, start + itemsPerPage);

    return { roles, totalPages, totalItems: filtered.length };
  }, [rolesQuery.data, searchQuery, currentPage, itemsPerPage]);

  if (rolesQuery.isLoading) {
    return <div className="text-purple-200">Загрузка...</div>;
  }

  if (rolesQuery.isError) {
    return <div className="text-red-400">Ошибка загрузки данных</div>;
  }

  return (
    <div className="space-y-6">
      <AddUserRoleForm
        onAdd={(name) => createRoleMutation.mutate(name)}
        isLoading={createRoleMutation.isPending}
      />

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
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                  Название роли
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-purple-300 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {filteredAndPaginatedData.roles.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-purple-900/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    {editingId === role.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500"
                      />
                    ) : (
                      <span className="text-purple-200">{role.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {editingId === role.id ? (
                        <>
                          <button
                            onClick={() => {
                              updateRoleMutation.mutate({
                                id: role.id,
                                name: editingName,
                              });
                              setEditingId(null);
                            }}
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
                            onClick={() => {
                              setEditingId(role.id);
                              setEditingName(role.name);
                            }}
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
                                  'Вы уверены, что хотите удалить эту роль?'
                                )
                              ) {
                                deleteRoleMutation.mutate(role.id);
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

      {(createRoleMutation.isPending ||
        updateRoleMutation.isPending ||
        deleteRoleMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-purple-900/90 text-purple-200 px-4 py-2 rounded-lg shadow-lg">
          Сохранение изменений...
        </div>
      )}
    </div>
  );
}
