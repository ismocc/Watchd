import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { enviroment } from '../../enviroment/enviroment';
import { AuthResponse, User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private url = `${enviroment.apiUrl}/auth`;

  user = signal<User | null>(null);

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  loadUser() {
    if (!this.isLoggedIn()) return;
    this.http.get<User>(`${this.url}/me`).subscribe({
      next: (user) => this.user.set(user),
      error: () => this.logout(),
    });
  }

  register(email: string, username: string, password: string, inviteCode: string) {
    return this.http
      .post<AuthResponse>(`${this.url}/register`, { email, username, password, inviteCode })
      .pipe(tap((res) => this.saveSession(res)));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.url}/login`, { email, password })
      .pipe(tap((res) => this.saveSession(res)));
  }

  logout() {
    localStorage.removeItem('token');
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    this.user.set(res.user);
  }
}
