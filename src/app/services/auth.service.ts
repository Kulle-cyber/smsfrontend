import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  role: string;
  username?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8889/api/login';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userRole = new BehaviorSubject<string | null>(this.getRoleFromStorage());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('username', response.username ?? '');
        this.loggedIn.next(true);
        this.userRole.next(response.role);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.loggedIn.next(false);
    this.userRole.next(null);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getRole(): Observable<string | null> {
    return this.userRole.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getRoleFromStorage(): string | null {
    return localStorage.getItem('role');
  }
}
