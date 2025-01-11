import React from 'react';
import { Product } from '../../types/product';
import { baseURL } from '../../api/axios';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-purple-900/50 rounded-lg shadow-lg p-4">
      <img
        src={`${baseURL}/${product.imagePath}`}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-bold text-purple-200">{product.name}</h3>
      <p className="text-purple-300">Цена: {product.price.toLocaleString()} ₽</p>
    </div>
  );
};

export default ProductCard;