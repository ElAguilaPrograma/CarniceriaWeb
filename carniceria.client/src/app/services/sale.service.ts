import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { enviroment } from "../../environments/enviroment";
import { Sale, SaleRequest } from "../models/sale.model";

@Injectable({
    providedIn: 'root'
})
export class SaleService {
    private readonly API_URL = `${enviroment.apiUrl}/Sales`;

    constructor(private http: HttpClient) {}

    createSale(branchId: number, saleRequest: SaleRequest): Observable<{ message: string; saleId: number }> {
        return this.http.post<{ message: string; saleId: number }>(`${this.API_URL}/createsale/${branchId}`, saleRequest);
    }

    getSalesWithDetails(branchId: number): Observable<{ message: string; count: number; data: Sale[] }> {
        return this.http.get<{ message: string; count: number; data: Sale[] }>(`${this.API_URL}/get-sales-with-details/${branchId}`);
    }

}