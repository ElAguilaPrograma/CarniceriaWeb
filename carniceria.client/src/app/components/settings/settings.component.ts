import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  stockValidation: boolean = false;

  constructor(private settingsService: SettingsService) { 
    this.stockValidation = this.settingsService.getStockValidation();
    this.settingsService.stockValidation$.subscribe(validation => {
      this.stockValidation = validation;
    });
  }

  toggleStockValidation(): void {
    this.settingsService.toggleStockValidation();
  }

}
