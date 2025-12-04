import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() type: 'new' | 'action' | 'edit' | 'delete' | 'disable' | 'submit' = 'submit';
  
  // Las clases que se repiten van en el html lo individual va en esta función
  getButtonClass(): string {
    const baseClasses = 'transition-colors duration-200';
    
    switch (this.type) {
      case 'new':
        return `${baseClasses} bg-green-500 hover:bg-green-700`;
      case 'action':
        return `${baseClasses} bg-yellow-500 hover:bg-yellow-700`;
      case 'edit':
        return `${baseClasses} bg-blue-500 hover:bg-blue-700`;
      case 'delete':
        return `${baseClasses} bg-red-500 hover:bg-red-700`;
      case 'disable':
        return `${baseClasses} bg-gray-500 hover:bg-gray-700`;
      case 'submit':
      default:
        return `${baseClasses} bg-gray-500 hover:bg-gray-700`;
    }
  }
}
