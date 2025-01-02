import { useState } from 'react';
import { Plus } from 'lucide-react';
import { UserRole } from '../../../types/user';
import { PhoneInput } from '../../booking/PhoneInput';
import { CodeInput } from '../../auth/CodeInput';

interface AddUserFormProps {
  onAdd: (userData: {
    phone: string;
    password: string;
    roleId: number;
  }) => void;
  roles: UserRole[];
  isLoading: boolean;
}

export function AddUserForm({ onAdd, roles, isLoading }: AddUserFormProps) {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    roleId: '',
  });

  const handleSubmit = () => {
    if (formData.phone && formData.password && formData.roleId) {
      onAdd({
        phone: formData.phone.replace(/[^\d]/g, ''),
        password: formData.password,
        roleId: parseInt(formData.roleId),
      });

      setFormData({
        phone: '',
        password: '',
        roleId: '',
      });
    }
  };

  return (
    <div className="bg-purple-950/50 rounded-xl p-4 shadow-lg">
      <h3 className="text-base font-semibold text-purple-200 mb-4">
        Добавить нового пользователя
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <PhoneInput
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            label="Телефон"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Код
          </label>
          <CodeInput
            code={formData.password.split('')}
            onChange={(code) =>
              setFormData({ ...formData, password: code.join('') })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Роль
          </label>
          <select
            value={formData.roleId}
            onChange={(e) =>
              setFormData({ ...formData, roleId: e.target.value })
            }
            className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
              text-purple-200 focus:outline-none focus:border-purple-500"
          >
            <option value="">Выберите роль</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={
          !formData.phone || !formData.password || !formData.roleId || isLoading
        }
        className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
          font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
          transition-all duration-300 active:scale-95 hover:scale-[1.02]
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        <span>Добавить пользователя</span>
      </button>
    </div>
  );
}
