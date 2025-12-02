import { Injectable } from "@angular/core";
import { ProductsService } from "./products.service";
import { Observable, of, switchMap } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class GenerateCodeService {
    constructor(private productsService: ProductsService) {}

    /** Genera un código válido (no existente) */
  generateCode(branchId: number): Observable<string> {
    const newCode = this.generateNumericCode(13);

    return this.productsService.checkProductCodeExists(branchId, newCode).pipe(
      switchMap((exists: boolean) => {

        if (exists) {
          // Si existe, volvemos a intentar recursivamente
          return this.generateCode(branchId);
        }

        // Si NO existe, lo devolvemos
        return of(newCode);
      })
    );
  }

  /** Genera un string numérico de N dígitos */
  private generateNumericCode(length: number): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }
}