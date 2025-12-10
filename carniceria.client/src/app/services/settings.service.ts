import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private stockValidation = new BehaviorSubject<boolean>(false);
  stockValidation$ = this.stockValidation.asObservable();

  constructor() { }

  toggleStockValidation(): void {
    this.stockValidation.next(!this.stockValidation.value);
    console.log('Stock validation toggled:', this.stockValidation.value);
  }

  getStockValidation(): boolean {
    return this.stockValidation.value;
  }
}
