import { Component } from '@angular/core';
import { ILoginDTO } from '../../models/login.model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData: ILoginDTO = { email: "", password: "" }
  loginError: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  onLogin(form: NgForm){
    if(form.valid){
      this.authService.login(this.loginData).subscribe({
        next: (res) => {
          console.log("Login exitoso", res);
          this.router.navigate(["/branches"]);
        },
        error: (err) => {
          console.log("Error al iniciar sesión", err);
          this.loginError = true;
        }
      })
    }
  }
}
