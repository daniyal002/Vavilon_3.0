import { useState, useMemo } from 'react';
import { useUsers } from '../../../hooks/useUsers';
import { useUserRoles } from '../../../hooks/useUserRoles';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import { AddUserForm } from './AddUserForm';
import { TableControls } from '../TableControls';
import { Pagination } from '../Pagination';
import { CodeInput } from '../../auth/CodeInput';
import { PhoneInput } from '../../booking/PhoneInput';

export function UsersTable() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({
    phone: '',
    password: '',
    roleId: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showPasswordChange, setShowPasswordChange] = useState<number | null>(
    null
  );

  const {
    usersQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  } = useUsers();

  const { rolesQuery } = useUserRoles();

  const filteredAndPaginatedData = useMemo(() => {
    if (!usersQuery.data) return { users: [], totalPages: 0, totalItems: 0 };

    const filtered = usersQuery.data.filter(
      (user) =>
        user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const users = filtered.slice(start, start + itemsPerPage);

    return { users, totalPages, totalItems: filtered.length };
  }, [usersQuery.data, searchQuery, currentPage, itemsPerPage]);

  if (usersQuery.isLoading || rolesQuery.isLoading) {
    return <div className="text-purple-200">Загрузка...</div>;
  }

  if (usersQuery.isError || rolesQuery.isError) {
    return <div className="text-red-400">Ошибка загрузки данных</div>;
  }

  return (
    <div className="space-y-6">
      <AddUserForm
        onAdd={(userData) => createUserMutation.mutate(userData)}
        roles={rolesQuery.data || []}
        isLoading={createUserMutation.isPending}
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
                  Телефон
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-purple-300 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {filteredAndPaginatedData.users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-purple-900/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <PhoneInput
                        value={editingData.phone}
                        onChange={(value) =>
                          setEditingData({ ...editingData, phone: value })
                        }
                        label=""
                      />
                    ) : (
                      <span className="text-purple-200">{user.phone}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <select
                        value={editingData.roleId}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            roleId: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                          text-purple-200 focus:outline-none focus:border-purple-500"
                      >
                        <option value="">Выберите роль</option>
                        {rolesQuery.data?.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-purple-200">{user.role.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === user.id &&
                      showPasswordChange === user.id && (
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-purple-300 mb-2">
                            Новый пароль
                          </label>
                          <CodeInput
                            code={editingData.password.split('')}
                            onChange={(code) =>
                              setEditingData({
                                ...editingData,
                                password: code.join(''),
                              })
                            }
                          />
                        </div>
                      )}
                    <div className="flex justify-end gap-2">
                      {editingId === user.id ? (
                        <>
                          <button
                            onClick={() => setShowPasswordChange(user.id)}
                            className="p-2 bg-blue-600/80 rounded-lg text-white 
                              hover:bg-blue-500 transition-colors flex items-center gap-1"
                          >
                            {showPasswordChange === user.id ? (
                              <span>Скрыть пароль</span>
                            ) : (
                              <span>Изменить пароль</span>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              updateUserMutation.mutate({
                                id: user.id,
                                userData: {
                                  phone: editingData.phone,
                                  roleId: parseInt(editingData.roleId),
                                  ...(editingData.password && {
                                    password: editingData.password,
                                  }),
                                },
                              });
                              setEditingId(null);
                              setShowPasswordChange(null);
                            }}
                            className="p-2 bg-green-600/80 rounded-lg text-white 
                              hover:bg-green-500 transition-colors flex items-center gap-1"
                          >
                            <Save size={16} />
                            <span>Сохранить</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setShowPasswordChange(null);
                            }}
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
                              setEditingId(user.id);
                              setEditingData({
                                phone: user.phone,
                                password: '',
                                roleId: user.roleId.toString(),
                              });
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
                                  'Вы уверены, что хотите удалить этого пользователя?'
                                )
                              ) {
                                deleteUserMutation.mutate(user.id);
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

      {(createUserMutation.isPending ||
        updateUserMutation.isPending ||
        deleteUserMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-purple-900/90 text-purple-200 px-4 py-2 rounded-lg shadow-lg">
          Сохранение изменений...
        </div>
      )}
    </div>
  );
}
