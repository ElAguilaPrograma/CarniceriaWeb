import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { IBranch } from "../models/branch.model";

@Injectable({
  providedIn: 'root'
})
export class BranchService {
    private baseUrl: string = 'https://localhost:7065/api/Branches';
    branchData: IBranch | null = null;
    private branchNameSubject = new BehaviorSubject<string>('Bienvenido');
    branchName$ = this.branchNameSubject.asObservable();

    constructor(private http: HttpClient) {
      // Inicializar con el nombre guardado en localStorage si hay alguno
      const savedBranch = localStorage.getItem('selectedBranch');
      if (savedBranch) {
        const branch = JSON.parse(savedBranch);
        this.branchNameSubject.next(branch.name);
      }
    }

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

    CurrentBranchData(branchId: number): Observable<IBranch> {
        return this.http.get<IBranch>(`${this.baseUrl}/getbranch/${branchId}`);
    }

    getCurrentBranchData(branchId: number): IBranch | null {
      this.CurrentBranchData(branchId).subscribe({
        next: (branchData) => {
          this.branchData = branchData;
        },
        error: (error) => {
          console.error('Error fetching branch data:', error);
        }
      })
      return this.branchData;
    }

    updateBranchName(name: string): void {
      this.branchNameSubject.next(name);
    }

    resetBranchName(): void {
      this.branchNameSubject.next('Bienvenido');
    }
}