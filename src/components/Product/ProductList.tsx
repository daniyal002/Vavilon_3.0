import { useState, useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from './ProductCard';
import { Product } from '../../types/product';

export function ProductList() {
  const { productsQuery } = useProducts();
  const { data: products, isLoading, isError } = productsQuery;

  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [products, searchQuery]);

  // Группировка продуктов по категориям
  const groupedProducts = useMemo(() => {
    const groups: { [key: string]: Product[] } = {};
    filteredProducts.forEach(product => {
      const categoryName = product.category.name;
      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(product);
    });
    return groups;
  }, [filteredProducts]);

  if (isLoading) {
    return <div className="text-purple-200">Загрузка меню...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Ошибка при загрузки меню</div>;
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-purple-200 mb-4">Меню</h2>

      {/* Поле поиска */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск по названию или категории..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-200 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Отображение товаров по категориям */}
      {Object.keys(groupedProducts).length > 0 ? (
        Object.keys(groupedProducts).map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-xl font-bold text-purple-300 mb-2">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedProducts[category].map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-purple-300">Нет товаров для отображения.</div>
      )}

    </>
  );
}

export default ProductList;