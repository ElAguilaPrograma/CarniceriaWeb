import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { IBranch } from "../models/branch.model";

@Injectable({
  providedIn: 'root'
})
export class BranchService {
    private baseUrl: string = 'https://localhost:7065/api/Branches';

    constructor(private http: HttpClient) { }

    show(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/showbranches`);
    }

    create(branchData: IBranch): Observable<any> {
        return this.http.post(`${this.baseUrl}/createbranches`, branchData).pipe(
          tap((res: any) => {
            console.log('Branch created successfully:', res);
          })
        );
    }

    update(branchInfoUpdate: IBranch, branchId: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/updatebranch/${branchId}`, branchInfoUpdate).pipe(
          tap((res: any) => {
            console.log('Branch updated successfully:', res);
          })
        );
    }

    delete(branchId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/deletebranch/${branchId}`);
    }
}