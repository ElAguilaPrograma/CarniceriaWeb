import { IProduct } from "./products.model";

export interface IOrder {
    orderId: string;
    products: Array<IProduct & { weight?: number; isCalculating?: boolean }>;
    createdAt: Date;
    total: number;
}