import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { takeLast } from 'rxjs';
import { AuthGuard } from '../../services/auth.guard';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  loginStatus: boolean = false;

  constructor(private authService: AuthService) { }

  @Output() toggleSidebar = new EventEmitter<void>();

  ngOnInit(): void {
    this.checkToken();
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
}
