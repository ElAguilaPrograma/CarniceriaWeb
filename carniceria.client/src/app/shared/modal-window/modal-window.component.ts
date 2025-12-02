import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-window',
  standalone: false,
  templateUrl: './modal-window.component.html',
  styleUrl: './modal-window.component.css',
})
export class ModalWindowComponent {
  @Input() openModal: boolean = false;
  @Input() title: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() data?: any;

  close(): void {
    this.openModal = false;
  }
}
