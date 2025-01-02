export interface PromoCode {
  id: number;
  code: string;
  type: string;
  value: number;
  startDate: Date;
  endDate: Date;
}

export interface CreatePromoCodeDTO {
  code: string;
  type: string;
  value: number;
  startDate: string;
  endDate: string;
}

export interface UpdatePromoCodeDTO extends CreatePromoCodeDTO {
  id: number;
}
