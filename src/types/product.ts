import { ProductCategory } from './productCategory';

export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  additionalInfo?: string;
  imagePath: string;
  category: ProductCategory;
}

export interface CreateProductDTO {
  name: string;
  price: number;
  categoryId: number;
  additionalInfo?: string;
  image: File;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: number;
}
