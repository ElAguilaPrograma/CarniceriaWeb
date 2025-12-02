import { _YAxis } from "@angular/cdk/scrolling";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ICategory } from "../models/category.model";

@Injectable({
    providedIn: "root"
})
export class CategoriesService {
    private apiUrlCategories = `api/Categories`;

    constructor(private http: HttpClient) {}

    getCategories(branchId: number): Observable<ICategory[]> {
        return this.http.get<ICategory[]>(`${this.apiUrlCategories}/showcategories-by-branch/${branchId}`);
    }

    createCategory(branchId: number, categoryData: ICategory): Observable<ICategory> {
        return this.http.post<ICategory>(`${this.apiUrlCategories}/createcategories-by-branch/${branchId}`, categoryData);
    }

    deleteCategory(branchId: number, categoryId: number): Observable<any> {
        return this.http.delete(`${this.apiUrlCategories}/deletecategory-by-branch/${branchId}/${categoryId}`, { responseType: 'text' });
    }
}