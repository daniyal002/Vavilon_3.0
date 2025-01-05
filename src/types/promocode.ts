import { Product } from "./product";

export interface PromoCode {
  id: number;
  code: string;
  type: string;
  value: number;
  startDate: Date;
  endDate: Date;
  productId?:number
  product?:Product
}

export interface CreatePromoCodeDTO {
  code: string;
  type: string;
  value: number | null;
  startDate: string;
  endDate: string;
  productId?:number | null
}

export interface UpdatePromoCodeDTO extends CreatePromoCodeDTO {
  id: number;
}
