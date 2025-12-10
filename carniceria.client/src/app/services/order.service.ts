import { Injectable } from "@angular/core";
import { IProduct } from "../models/products.model";
import { IOrder } from "../models/order.model";

@Injectable({
    providedIn: "root"
})
export class OrderService {
    private readonly ORDERS_KEY = 'orders';
    private readonly LAST_ORDER_ID_KEY = 'lastOrderId';

    constructor() {}

    private generateOrderId(): string {
        const lastId = localStorage.getItem(this.LAST_ORDER_ID_KEY);
        let nextId = lastId ? parseInt(lastId, 10) + 1 : 10000;
        
        // Asegurar que siempre sea de 5 dígitos
        if (nextId > 99999) {
            nextId = 10000;
        }
        
        localStorage.setItem(this.LAST_ORDER_ID_KEY, nextId.toString());
        return nextId.toString().padStart(5, '0');
    }

    private getAllOrdersFromStorage(): IOrder[] {
        const ordersJson = localStorage.getItem(this.ORDERS_KEY);
        return ordersJson ? JSON.parse(ordersJson) : [];
    }

    private saveOrdersToStorage(orders: IOrder[]): void {
        localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    }

    saveOrder(products: Array<IProduct & { weight?: number; isCalculating?: boolean }>, total: number): string {
        const orderId = this.generateOrderId();
        const orders = this.getAllOrdersFromStorage();
        
        const newOrder: IOrder = {
            orderId,
            products,
            createdAt: new Date(),
            total
        };
        
        orders.push(newOrder);
        this.saveOrdersToStorage(orders);
        
        return orderId;
    }

    getAllOrders(): IOrder[] {
        return this.getAllOrdersFromStorage();
    }

    getOrderById(orderId: string): IOrder | undefined {
        const orders = this.getAllOrdersFromStorage();
        return orders.find(order => order.orderId === orderId);
    }

    clearOrder(): void {
        localStorage.removeItem('productSelected');
    }

    clearOrderById(orderId: string): void {
        const orders = this.getAllOrdersFromStorage();
        const updatedOrders = orders.filter(order => order.orderId !== orderId);
        this.saveOrdersToStorage(updatedOrders);
    }

    clearAllOrders(): void {
        localStorage.removeItem(this.ORDERS_KEY);
        localStorage.removeItem(this.LAST_ORDER_ID_KEY);
    }
}