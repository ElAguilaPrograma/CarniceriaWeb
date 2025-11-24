import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { MainComponent } from './components/main/main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './services/auth.guard';
import { BranchesComponent } from './components/branches/branches.component';

const routes: Routes = [
  { path: "", redirectTo: "main", pathMatch: "full" }, //Ruta por defecto
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent},

  {
    path: "",
    component: LayoutComponent,
    //Aqui van los componentes que necesitan layout o header
    children: [
      { path: "main", component: MainComponent }, //sin guardia
      { path: "settings", component: SettingsComponent, canActivate: [AuthGuard] },
      { path: "home", component: HomeComponent, canActivate: [AuthGuard]},
      { path: "branches", component: BranchesComponent, canActivate: [AuthGuard]}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
