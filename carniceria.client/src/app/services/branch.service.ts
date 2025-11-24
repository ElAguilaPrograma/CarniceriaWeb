import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BranchService {
    private baseUrl: string = 'https://localhost:7065/api/Branches';

    constructor(private http: HttpClient) { }

    show(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/showbranches`);
    }
}