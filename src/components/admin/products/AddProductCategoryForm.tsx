import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddProductCategoryFormProps {
  onAdd: (name: string) => void;
  isLoading: boolean;
}

export function AddProductCategoryForm({
  onAdd,
  isLoading,
}: AddProductCategoryFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name);
      setName('');
    }
  };

  return (
    <div className="bg-purple-950/50 rounded-xl p-4 shadow-lg">
      <h3 className="text-base font-semibold text-purple-200 mb-4">
        Добавить новую категорию
      </h3>
      <div className="flex gap-4 flex-col md:flex-row">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название категории"
          className="flex-1 p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || isLoading}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
            font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
            transition-all duration-300 active:scale-95 hover:scale-[1.02]
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Добавить</span>
        </button>
      </div>
    </div>
  );
}
