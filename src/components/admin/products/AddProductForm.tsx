import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ProductCategory } from '../../../types/productCategory';

interface AddProductFormProps {
  onAdd: (formData: FormData) => void;
  isLoading: boolean;
  categories: ProductCategory[];
}

export function AddProductForm({
  onAdd,
  isLoading,
  categories,
}: AddProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    additionalInfo: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (formData.name && formData.price && formData.categoryId && image) {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('price', formData.price);
      submitData.append('categoryId', formData.categoryId);
      submitData.append('additionalInfo', formData.additionalInfo);
      submitData.append('image', image);

      onAdd(submitData);

      // Сброс формы
      setFormData({
        name: '',
        price: '',
        categoryId: '',
        additionalInfo: '',
      });
      setImage(null);
      setImagePreview(null);
    }
  };

  return (
    <div className="bg-purple-950/50 rounded-xl p-4 shadow-lg">
      <h3 className="text-base font-semibold text-purple-200 mb-4">
        Добавить новый товар
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-purple-300 mb-1">
              Название
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500"
              placeholder="Название товара"
            />
          </div>

          <div>
            <label className="block text-sm text-purple-300 mb-1">
              Категория
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                text-purple-200 focus:outline-none focus:border-purple-500"
            >
              <option value="">Выберите категорию</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-purple-300 mb-1">Цена</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-purple-300 mb-1">
              Изображение
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                text-purple-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                file:text-sm file:font-semibold file:bg-purple-600 file:text-white
                hover:file:bg-purple-500"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-purple-300 mb-1">
              Дополнительная информация
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) =>
                setFormData({ ...formData, additionalInfo: e.target.value })
              }
              className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500
                resize-none h-[104px]"
              placeholder="Дополнительная информация о товаре"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={
          !formData.name ||
          !formData.price ||
          !formData.categoryId ||
          !image ||
          isLoading
        }
        className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
          font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
          transition-all duration-300 active:scale-95 hover:scale-[1.02]
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        <span>Добавить товар</span>
      </button>
    </div>
  );
}
