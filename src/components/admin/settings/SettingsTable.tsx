import { useState } from 'react';
import { useSettings } from '../../../hooks/useSettings';
import { Setting } from '../../../types/settings';

export function SettingsTable() {
  const { getSettings, updateSetting } = useSettings();
  const { data: settings, isLoading, isError, error } = getSettings;

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<boolean>(false);

  const handleEdit = (setting: Setting) => {
    setEditingKey(setting.key);
    setNewValue(setting.value);
  };

  const handleSave = (key: string) => {
    updateSetting.mutate({ key, value: newValue });
    setEditingKey(null);
  };

  if (isLoading) {
    return <div className="text-purple-200">Загрузка настроек...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Ошибка: {error.message}</div>;
  }

  return (
    <div className="overflow-x-auto bg-purple-950/50 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-purple-200 mb-4">Настройки</h2>
      <table className="min-w-full bg-purple-900/50 rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-purple-200">Ключ</th>
            <th className="px-4 py-2 text-left text-purple-200">Значение</th>
            <th className="px-4 py-2 text-left text-purple-200">Действия</th>
          </tr>
        </thead>
        <tbody>
          {settings && settings.length > 0 ? (
            settings.map((setting) => (
              <tr key={setting.key} className="border-t border-purple-700">
                <td className="px-4 py-2 text-purple-100">{setting.key}</td>
                <td className="px-4 py-2 text-purple-100">
                  {editingKey === setting.key ? (
                    <input
                      type="checkbox"
                      checked={newValue}
                      onChange={(e) => setNewValue(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-purple-600"
                    />
                  ) : setting.value ? (
                    'Включено'
                  ) : (
                    'Выключено'
                  )}
                </td>
                <td className="px-4 py-2 text-purple-100">
                  {editingKey === setting.key ? (
                    <button
                      onClick={() => handleSave(setting.key)}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg"
                    >
                      Сохранить
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(setting)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                    >
                      Редактировать
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-4 py-2 text-center text-purple-300">
                Нет данных для отображения.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {updateSetting.isPending && (
        <div className="text-purple-200">Сохранение...</div>
      )}
      {updateSetting.isError && (
        <div className="text-red-500">
          Ошибка: {updateSetting.error?.message}
        </div>
      )}
      {updateSetting.isSuccess && (
        <div className="text-green-500">Настройка успешно обновлена!</div>
      )}
    </div>
  );
}

export default SettingsTable;
