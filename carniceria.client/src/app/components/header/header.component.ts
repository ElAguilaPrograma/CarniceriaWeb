import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { filter, takeLast } from 'rxjs';
import { AuthGuard } from '../../services/auth.guard';
import { NavigationEnd, Route, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  loginStatus: boolean = false;
  hideCollapseSidebarIcon: boolean = true;

  constructor(private authService: AuthService,
              private router: Router
  ) { }

  @Output() toggleSidebar = new EventEmitter<void>();

  ngOnInit(): void {
    this.checkToken();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Si la ruta es /branches, ocultar el ícono de colapsar el sidebar
      this.hideCollapseSidebarIcon = event.url.includes('/branches');
    });
    this.printShowCollapseSidebarIcon();
  }

  checkToken(): void {
    if (this.authService.isLoggedIn()){
      this.loginStatus = true;
    }
    else{
      this.loginStatus = false;
    }
  }

  logOut(): void {
    const leaving = this.authService.logout();
    window.location.reload();
  }

  printShowCollapseSidebarIcon(): void {
    console.log('hideCollapseSidebarIcon:', this.hideCollapseSidebarIcon);
  }
}
