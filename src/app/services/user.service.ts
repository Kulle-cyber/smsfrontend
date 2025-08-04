import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import type { User, Role } from '../models/user.model'; // 'type' is okay for interfaces
//import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8889/api';

  constructor(private http: HttpClient) {}

  // ✅ Get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(catchError(this.handleError));
  }

  // ✅ Get all roles
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/roles`).pipe(catchError(this.handleError));
  }

  // ✅ Create a new user with hashed password
  createUser(userData: {
    username: string;
    password: string;
    roleId: number;
    fullName?: string;
    email?: string;
  }): Observable<User> {
    const userToCreate: User = {
      username: userData.username,
     // passwordHash: bcrypt.hashSync(userData.password, 10),
      roleId: userData.roleId,
      fullName: userData.fullName,
      email: userData.email,
    };

    return this.http.post<User>(`${this.baseUrl}/users`, userToCreate).pipe(catchError(this.handleError));
  }

  // ✅ Update user's role by userId
  updateUserRole(userId: number, roleId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/${userId}/role`, { roleId }).pipe(catchError(this.handleError));
  }

  // ✅ Update user details
  updateUser(userId: number, userData: {
    username: string;
    email?: string;
    password?: string;
  }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/${userId}`, userData).pipe(catchError(this.handleError));
  }

  // ✅ Delete user
  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/users/${userId}`).pipe(catchError(this.handleError));
  }

  // ✅ Search users
  searchUsers(query: string): Observable<User[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<User[]>(`${this.baseUrl}/users/search`, { params }).pipe(catchError(this.handleError));
  }

  // ✅ Get user by ID
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${userId}`).pipe(catchError(this.handleError));
  }

  // ✅ Error handler
  private handleError(error: HttpErrorResponse) {
    console.error('HTTP Error:', error);
    return throwError(() => error);
  }
}
