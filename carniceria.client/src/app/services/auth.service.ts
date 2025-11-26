import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ILoginDTO } from "../models/login.model";
import { Observable, tap, interval, Subscription } from "rxjs";
import { IRegisterDTO } from "../models/register.model";
import { enviroment } from "../../environments/enviroment";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root"
})

export class AuthService {
    private apiUrlLogin = `${enviroment.apiUrl}/Authentication/login`;
    private apiUrlRegister = `${enviroment.apiUrl}/Authentication/register`;
    private tokenCheckSubscription?: Subscription;

    constructor(private http: HttpClient, private router: Router) {
        this.startTokenExpirationCheck();
    }

    login(credentials: ILoginDTO): Observable<any> {
        return this.http.post(this.apiUrlLogin, credentials).pipe(
            tap((res: any) => {
                //El backend devuelve el token JWT y se guarda en local storage
                localStorage.setItem("token", res.token)

                if (res.expiresAt) {
                    localStorage.setItem("tokenExpiration", res.expiresAt);
                }
                console.log("Token guardado, expira en:", res.expiresAt);
                
                // Reiniciar el chequeo de expiración después del login
                this.startTokenExpirationCheck();
            })
        )
    }

    register(credentials: IRegisterDTO): Observable<any> {
        return this.http.post(this.apiUrlRegister, credentials).pipe(
            tap((res: any) => {
                console.log(res);
            })
        )
    }

    getToken(): string | null {
        return localStorage.getItem("token");
    }

    logout(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        this.stopTokenExpirationCheck();
        console.log("Sesión cerrada, token eliminado.");
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        if (!token) return false;

        return !this.isTokenExpired();
    }

    isTokenExpired(): boolean {
        const expiration = localStorage.getItem("tokenExpiration");
        if (!expiration) {
            return true;
        }
        const expirationDate = new Date(expiration);
        const now = new Date();
        const isExpired = expirationDate <= now;

        // Debug para ver las fechas
        //console.log("Fecha de expiración:", expirationDate.toISOString());
        //console.log("Fecha actual:", now.toISOString());
        //console.log("¿Está expirado?:", isExpired);
        //console.log("Diferencia en segundos:", (expirationDate.getTime() - now.getTime()) / 1000);

        return isExpired;
    }

    handleSessionExpiration(): void {
        console.log("Manejando expiración de sesión.");
        this.logout();
        alert("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
        this.router.navigate(['/login']);
    }

    // Método para iniciar el chequeo automático de expiración cada 5 segundos
    private startTokenExpirationCheck(): void {
        // Detener cualquier chequeo previo
        this.stopTokenExpirationCheck();

        // Iniciar nuevo chequeo cada 5 segundos (5000ms)
        this.tokenCheckSubscription = interval(5000).subscribe(() => {
            if (this.getToken() && this.isTokenExpired()) {
                console.log("Token expirado detectado en chequeo automático");
                this.handleSessionExpiration();
            }
        });
    }

    // Método para detener el chequeo automático
    private stopTokenExpirationCheck(): void {
        if (this.tokenCheckSubscription) {
            this.tokenCheckSubscription.unsubscribe();
            this.tokenCheckSubscription = undefined;
        }
    }
}