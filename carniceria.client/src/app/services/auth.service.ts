import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ILoginDTO } from "../models/login.model";
import { Observable, tap } from "rxjs";
import { IRegisterDTO } from "../models/register.model";
import { enviroment } from "../../environments/enviroment";

@Injectable({
    providedIn: "root"
})

export class AuthService {
    private apiUrlLogin = `${enviroment.apiUrl}/Authentication/login`;
    private apiUrlRegister = `${enviroment.apiUrl}/Authentication/register`;

    constructor(private http: HttpClient) {}

    login(credentials: ILoginDTO): Observable<any> {
        return this.http.post(this.apiUrlLogin, credentials).pipe(
            tap((res: any) => {
                //El backend devuelve el token JWT y se guarda en local storage
                localStorage.setItem("token", res.token)
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
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}