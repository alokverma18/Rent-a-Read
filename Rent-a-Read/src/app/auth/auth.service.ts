import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private loggedUser?: string;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private router = inject(Router);
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5000';

  constructor() {}

  login(user: { email: string; password: string; role: string }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/auth/login`, user)
      .pipe(
        tap((tokens: any) =>
          this.doLoginUser(user.email, JSON.stringify(tokens))
        )
      );
  }

  private doLoginUser(email: string, token: any) {
    this.loggedUser = email;
    this.storeJwtToken(token);
    this.isAuthenticatedSubject.next(true);
  }

  getDecodedToken(): any {
    const tokens = localStorage.getItem(this.JWT_TOKEN);
    if (!tokens) return null;
    return jwtDecode(JSON.parse(tokens).access_token);
  }

  // Get user role from the decoded token
  getUserRole(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.role : null;
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getCurrentAuthUser() {
    return this.http.get(`${this.apiUrl}/auth/user`);
  }

  isLoggedIn() {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  isTokenExpired() {
    const tokens = localStorage.getItem(this.JWT_TOKEN);
    if (!tokens) return true;
    const token = JSON.parse(tokens).access_token;
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    const expirationDate = decoded.exp * 1000;
    const now = new Date().getTime();

    return expirationDate < now;
  }

  refreshToken() {
    let tokens = localStorage.getItem(this.JWT_TOKEN);
    if (!tokens) return;
    let refreshToken = JSON.parse(tokens).refresh_token;

    return this.http
        .post<any>(`${this.apiUrl}/auth/refresh`, {
            refresh_token: refreshToken // Make sure the key matches what your backend expects
        })
        .pipe(
            tap((tokens: any) => {
                this.storeJwtToken(JSON.stringify(tokens));
            })
        )
  }


  register(user: { email: string, username: string, password: string, role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

}
