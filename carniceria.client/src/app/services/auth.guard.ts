import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { HeaderComponent } from "../components/header/header.component";

@Injectable({
    providedIn: "root"
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }
    
    canActivate(): boolean {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(["/main"]);
            return false;
        }
        return true;
    }
}