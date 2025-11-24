import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IRegisterDTO } from '../../models/register.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData: IRegisterDTO = {name: "", email: "", password: "" }

  constructor(private router: Router, private authService: AuthService) { }

  onRegister(form: NgForm) {
    if (form.valid){
      this.authService.register(this.registerData).subscribe({
        next: (res) => {
          console.log("Registrado con exito", res);
          this.router.navigate(["/login"]);
        },
        error: (err) => {
          console.log("Error al registrar al usuario", err);
        }
      })
    }
    else{
      alert("Por favor complete todos los campos");
    }
  }
}
