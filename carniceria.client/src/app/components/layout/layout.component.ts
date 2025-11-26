import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{
  isSidebarCollapsed = false;
  token: string = localStorage.getItem('token') || '';
  showSidebar: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Oculta el sidebar en la página de sucursales
      this.showSidebar = !event.url.includes('/branches');
    });
  }

  toggleSidebar(): void{
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
