import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  private router = inject(Router);
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() {}

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  login(user: { email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, user).pipe(
      tap((tokens: any) => this.doLoginUser(user.email, JSON.stringify(tokens)))
    );
  }

  googleLogin(token: any) {
    this.doLoginUser('', token);
  }

  githubLogin(token: any) {
    this.doLoginUser('', token);
  }

  private doLoginUser(email: string, token: any) {
    this.storeJwtToken(token);
    this.isAuthenticatedSubject.next(true);
    this.updateUserRole();
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private updateUserRole() {
    const role = this.getUserRole();
    this.userRoleSubject.next(role);
  }

  getDecodedToken(): any {
    const tokens = localStorage.getItem(this.JWT_TOKEN);
    if (!tokens) return null;
    return jwtDecode(JSON.parse(tokens).access_token);
  }

  getUserRole(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken && decodedToken.role ? decodedToken.role : null;
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isAuthenticatedSubject.next(false);
    this.userRoleSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.JWT_TOKEN);
    return !!token && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
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
    const tokens = localStorage.getItem(this.JWT_TOKEN);
    if (!tokens) return;
    const refreshToken = JSON.parse(tokens).refresh_token;

    return this.http.post<any>(`${this.apiUrl}/auth/refresh`, { refresh_token: refreshToken }).pipe(
      tap((tokens: any) => {
        this.storeJwtToken(JSON.stringify(tokens));
        this.isAuthenticatedSubject.next(true);
        this.updateUserRole();
      })
    );
  }

  register(user: { email: string; username: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }
}
