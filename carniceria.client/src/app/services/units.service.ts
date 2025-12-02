import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IUnit } from "../models/unit.model";

@Injectable({
    providedIn: "root"
})
export class UnitsService {
    private apiUrlUnits = `api/MeasurementUnit`;

    constructor(private http: HttpClient) {}

    getUnits(branchId: number): Observable<IUnit[]> {
        return this.http.get<IUnit[]>(`${this.apiUrlUnits}/showmeasurementunit-by-branch/${branchId}`);
    }
}