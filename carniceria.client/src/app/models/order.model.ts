import { IBranch } from "./branch.model";
import { IProduct } from "./products.model";

export interface CreateOrderRequest {
  branchId: number;
  name: string;
  details: OrderProductInput[];
}

export interface OrderProductInput {
  productId: number;
  weightOrQuantity: number; // kg, gramos o piezas
}

export interface Order {
  orderId: number;
  name: string;
  registrationDate: string; 
  isComplete: boolean;
  total: number;
  details: OrderDetail[];
}

export interface OrderDetail {
  orderDetailId: number;
  productId: number;
  productName: string;
  unitPrice: number;
  weightOrQuantity: number;
  subtotal: number;
}

