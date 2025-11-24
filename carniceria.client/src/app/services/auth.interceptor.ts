import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.authService.getToken();

        if (authToken) {
            const cloned = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            return next.handle(cloned);
        } 
        return next.handle(req);
    }
}