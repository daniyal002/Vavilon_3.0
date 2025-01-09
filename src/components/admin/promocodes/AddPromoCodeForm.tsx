import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useProducts } from '../../../hooks/useProducts';
import ProductSelect from '../../UI/ProductSelect';
import { Product } from '../../../types/product';

interface AddPromoCodeFormProps {
  onAdd: (promoCodeData: {
    code: string;
    type: string;
    value: number;
    startDate: string;
    endDate: string;
  }) => void;
  isLoading: boolean;
}

export function AddPromoCodeForm({ onAdd, isLoading }: AddPromoCodeFormProps) {
  const [formData, setFormData] = useState({
    code: '',
    type: '',
    value: '',
    startDate: '',
    endDate: '',
    productId: '',
  });

  const handleSubmit = () => {
    if (
      formData.code &&
      formData.type &&
      (formData.value || formData.productId)
    ) {
      onAdd({
        ...formData,
        value: formData.productId ? 100 : parseFloat(formData.value),
      });
      setFormData({
        code: '',
        type: '',
        value: '',
        startDate: '',
        endDate: '',
        productId: '',
      });
    }
  };

  const { productsQuery } = useProducts();
  const { data: productstData } = productsQuery;

  return (
    <div className="bg-purple-950/50 rounded-xl p-4 shadow-lg">
      <h3 className="text-base font-semibold text-purple-200 mb-4">
        Добавить новый промокод
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-purple-300 mb-1">Код</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
              placeholder="Введите код"
            />
          </div>
          <div>
            <label className="block text-sm text-purple-300 mb-1">Тип</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
            >
              <option value="">Выберите тип</option>
              <option value="PERCENTAGE">Процент</option>
              <option value="FIXED">Фиксированная сумма</option>
              <option value="PRODUCT">Товар</option>
            </select>
          </div>
        </div>

        {formData.type !== 'PRODUCT' && (
          <div>
            <label className="block text-sm text-purple-300 mb-1">
              Значение
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
              }
              className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
              text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
              placeholder="Введите значение"
            />
          </div>
        )}

        {formData.type === 'PRODUCT' && (
          <div>
            <ProductSelect
              products={productsQuery?.data as Product[]}
              selectedProductId={formData.productId}
              onChange={(productId) => setFormData({ ...formData, productId })}
              isLabel={true}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-purple-300 mb-1">
              Дата начала
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-purple-300 mb-1">
              Дата окончания
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="w-full p-2.5 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={
            !formData.code ||
            !formData.type ||
            (formData.type === 'PRODUCT'
              ? !formData.productId
              : !formData.value) ||
            isLoading
          }
          className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
            font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
            transition-all duration-300 active:scale-95 hover:scale-[1.02]
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          <span>Добавить промокод</span>
        </button>
      </div>
    </div>
  );
}
