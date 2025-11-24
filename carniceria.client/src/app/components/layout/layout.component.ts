import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isSidebarCollapsed = false;
  token: string = localStorage.getItem('token') || '';

  toggleSidebar(): void{
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
