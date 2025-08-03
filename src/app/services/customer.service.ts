import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private baseUrl = 'http://localhost:8889/api/customers';

  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl);
  }

  registerCustomer(customer: Customer): Observable<any> {
    return this.http.post(this.baseUrl, customer);
  }

  updateCustomer(customer: Customer): Observable<any> {
    return this.http.put(`${this.baseUrl}/${customer.id}`, customer);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  login(email: string, password: string): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/login`, { email, password });
  }
}
