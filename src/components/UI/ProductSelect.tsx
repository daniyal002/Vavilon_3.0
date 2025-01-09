import React, { useState } from 'react';
import { Product } from '../../types/product';

interface ProductSelectProps {
  products: Product[];
  selectedProductId: string;
  onChange: (productId: string) => void;
  isLabel: boolean;
}

const ProductSelect: React.FC<ProductSelectProps> = ({
  products,
  selectedProductId,
  onChange,
  isLabel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Фильтруем товары по поисковому запросу
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      {isLabel && (
        <label className="block text-sm text-purple-300 mb-1">Товар</label>
      )}
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск товара..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)} // Задержка для обработки клика
          className="w-full p-3 bg-purple-900/50 border border-purple-700/30 rounded-lg 
            text-purple-200 focus:outline-none focus:border-purple-500 text-sm"
        />
        {isDropdownOpen && (
          <div className="absolute z-10 w-full bg-purple-900 border border-purple-700 rounded-lg mt-1 max-h-60 overflow-y-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div
                  key={product.id}
                  onMouseDown={() => {
                    onChange(String(product.id)); // Выбор товара
                    setSearchQuery(product.name); // Установка названия в поле ввода
                    setIsDropdownOpen(false); // Закрытие выпадающего списка
                  }}
                  className={`p-3 text-purple-200 cursor-pointer hover:bg-purple-800/50 ${
                    selectedProductId === String(product.id) ? 'bg-purple-600' : ''
                  }`}
                >
                  {product.name}
                </div>
              ))
            ) : (
              <div className="p-3 text-purple-400">Товары не найдены</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSelect;