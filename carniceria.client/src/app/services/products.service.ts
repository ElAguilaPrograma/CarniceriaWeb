import { Injectable } from "@angular/core";
import { enviroment } from "../../environments/enviroment";
import { HttpClient } from "@angular/common/http";
import { map, Observable, tap } from "rxjs";
import { IProduct } from "../models/products.model";

@Injectable({
    providedIn: "root"
})

export class ProductsService {
    private apiUrlProducts = `${enviroment.apiUrl}/Products`;

    constructor(private http: HttpClient) {}

    getProducts(branchId: number): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(`${this.apiUrlProducts}/products-by-branch/${branchId}`);
    }

    createProduct(branchId: number, productData: IProduct): Observable<IProduct> {
        return this.http.post<IProduct>(`${this.apiUrlProducts}/createproducts-by-branch/${branchId}`, productData).pipe(
            tap((res: IProduct) => {
                console.log('Product created:', res);
            })
        );
    }

    updateProduct(branchId: number, productId: number, productData: IProduct): Observable<IProduct> {
        return this.http.put<IProduct>(`${this.apiUrlProducts}/updateproducts-by-branch/${branchId}/${productId}`, productData).pipe(
            tap((res: IProduct) => {
                console.log('Product updated:', res);
            })
        );
    }

    deleteProduct(branchId: number, productId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrlProducts}/deleteproduct-by-branch/${branchId}/${productId}`);
    }

    checkProductCodeExists(branchId: number, code: string): Observable<boolean> {
        return this.http.get<{ exists: boolean }>(`${this.apiUrlProducts}/checkifproductcodeexist/${branchId}/${code}`).pipe(
            tap(response => {
                console.log('Check product code exists:', response.exists);
            }),
            map(response => {
                console.log('Mapping response to boolean:', response.exists);
                return response.exists;
            })
        );
    }

    searchProducts(branchId: number, searchTerm: string): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(`${this.apiUrlProducts}/searchproduct-by-branch/${branchId}/${encodeURIComponent(searchTerm)}`).pipe(
            tap((res: IProduct[]) => {
                console.log('Search products result:', res);
            })
        )
    }

    searchMeats(branchId: number, searchTerm: string): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(`${this.apiUrlProducts}/searchmeat-by-branch/${branchId}/${encodeURIComponent(searchTerm)}`).pipe(
            tap((res: IProduct[]) => {
                console.log('Search meats result:', res);
            })
        )
    }

    searchAbarroteProducts(branchId: number, searchTerm: string): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(`${this.apiUrlProducts}/searchabarrote-by-branch/${branchId}/${encodeURIComponent(searchTerm)}`).pipe(
            tap((res: IProduct[]) => {
                console.log('Search abarrotes result:', res);
            })
        )
    }

    getMeatPrice(productId: number, branchId: number, weight: number): Observable<IProduct> {
        return this.http.get<IProduct>(`/api/Sales/getprice-of-meat/${productId}/${branchId}/${weight}`);
    }

}