import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { filter, takeLast } from 'rxjs';
import { AuthGuard } from '../../services/auth.guard';
import { NavigationEnd, Route, Router } from '@angular/router';
import { BranchService } from '../../services/branch.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  loginStatus: boolean = false;
  hideCollapseSidebarIcon: boolean = false;
  branchExist = false;
  nameBranch: string = "Bienvenido";
  openConfirmModalLogout: boolean = false;

  constructor(private authService: AuthService,
              private router: Router,
              private branchService: BranchService,
              private orderService: OrderService
  ) { }

  @Output() toggleSidebar = new EventEmitter<void>();

  ngOnInit(): void {
    this.checkToken();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Si la ruta es /branches, ocultar el ícono de colapsar el sidebar
      this.hideCollapseSidebarIcon = event.url.includes('/branches');
      
      // Si estamos en /branches, resetear el nombre a "Bienvenido"
      if (event.url.includes('/branches')) {
        this.branchService.resetBranchName();
      }
    });
    this.printShowCollapseSidebarIcon();
    
    // Suscribirse a los cambios del nombre de la sucursal
    this.branchService.branchName$.subscribe(name => {
      this.nameBranch = name;
    });
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
    this.branchService.deleteSeletedBranchFromLocalStorage();
    window.location.reload();
  }

  printShowCollapseSidebarIcon(): void {
    console.log('hideCollapseSidebarIcon:', this.hideCollapseSidebarIcon);
  }

}
