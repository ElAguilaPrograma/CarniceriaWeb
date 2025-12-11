export interface SaleRequest {
  SaleDetails: SaleDetailInput[];
}

export interface SaleDetailInput {
  ProductId: number;
  OrderId?: number | null;
  WeightOrQuantity: number;
}

export interface Sale {
  saleId: number;
  branchId: number;
  userId: number;
  date: string;
  isComplete: boolean;
  totalSale: number;
  itemsCount: number;
  details: SaleDetail[];
}

export interface SaleDetail {
  saleDetailId: number;
  productId: number;
  productCode: string;
  productName: string;
  categoryName: string;
  unitName: string;
  price: number;
  orderId?: number | null;
  total: number;
}
