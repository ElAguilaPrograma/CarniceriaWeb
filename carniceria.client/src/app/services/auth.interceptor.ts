import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // No verificar expiración en rutas de autenticación (login/register)
        const isAuthRoute = req.url.includes('/Authentication/login') || 
                           req.url.includes('/Authentication/register');

        // Solo verificar expiración si NO es una ruta de autenticación
        if (!isAuthRoute && this.authService.isTokenExpired()) {
            console.warn("Token expirado detectado en el interceptor");
            this.authService.handleSessionExpiration();
            return throwError(() => new Error('Token expirado'));
        }

        const authToken = this.authService.getToken();

        if (authToken && !isAuthRoute) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${authToken}`
                }
            });
        } 

        //Interceptar respuestas de error
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    console.error("Token inválido o expirado (respuesta del servidor)");
                    this.authService.handleSessionExpiration();
                }

                return throwError(() => error);
            })
        )
    }
}