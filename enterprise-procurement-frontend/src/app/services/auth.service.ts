import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private baseUrl = "http://localhost:8080";

    constructor(private http: HttpClient) {}

    login(loginData: any, role: string): Observable<any> {
        let loginUrl ='';
        if (role === 'USER') {
            loginUrl = `${this.baseUrl}/users/login`;
        }

        else if (role === 'ADMIN') {
            loginUrl = `${this.baseUrl}/admin/login`;
        }

        else if (role === 'SUPPLIER') {
            loginUrl = `${this.baseUrl}/suppliers/login`;
        }

        return this.http.post(loginUrl, loginData);
    }
}