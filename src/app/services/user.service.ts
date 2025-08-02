import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, Role } from '../models/user.model';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8889/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
      catchError(this.handleError)
    );
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/roles`).pipe(
      catchError(this.handleError)
    );
  }

  createUser(userData: {
    username: string;
    password: string;
    roleId: number;
    fullName?: string;
    email?: string;
  }): Observable<User> {
    const userToCreate: User = {
      username: userData.username,
      passwordHash: bcrypt.hashSync(userData.password, 10),
      roleId: userData.roleId,
      fullName: userData.fullName,
      email: userData.email
    };

    return this.http.post<User>(`${this.baseUrl}/users`, userToCreate).pipe(
      catchError(this.handleError)
    );
  }

  updateUserRole(userId: number, roleId: number): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${userId}/role`, { roleId }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
