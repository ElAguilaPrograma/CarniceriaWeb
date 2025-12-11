import { Injectable } from "@angular/core";
import { IProduct } from "../models/products.model";
import { CreateOrderRequest, Order } from "../models/order.model";
import { HttpClient } from "@angular/common/http";
import { enviroment } from "../../environments/enviroment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class OrderService {
    private readonly API_URL = `${enviroment.apiUrl}/Orders`;

    constructor(private http: HttpClient) {}

    createOrder(request: CreateOrderRequest): Observable<CreateOrderRequest> {
        return this.http.post<CreateOrderRequest>(`${this.API_URL}/createorder/${request.branchId}`, request);
    }

    getOrdersWithDetails(branchId: number): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.API_URL}/get-orders-with-details/${branchId}`);
    }

    getOrderTotal(orderId: number): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/get-order-total/${orderId}`);
    }

    completeOrder(orderId: number): Observable<{ message: string; orderId: number }> {
        return this.http.put<{ message: string; orderId: number }>(`${this.API_URL}/complete-order/${orderId}`, {});
    }

}