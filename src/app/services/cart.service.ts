// services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8889/api';
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Fetch cart from backend
  fetchCart(): void {
    const customerId = this.authService.getCustomerId();
    if (!customerId) return;

    this.http.get<CartItem[]>(`${this.apiUrl}/cart/${customerId}`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (res) => {
        this.cartItems = res;
        this.cartSubject.next([...this.cartItems]);
      },
      error: (err) => console.error('Error fetching cart:', err)
    });
  }

  // Add item to cart
  addToCart(item: CartItem): Observable<any> {
    const customerId = this.authService.getCustomerId();
    if (!customerId) {
      throw new Error('User not authenticated');
    }

    const payload = {
      customerId,
      productId: item.productId,
      quantity: item.quantity || 1
    };

    return this.http.post(`${this.apiUrl}/cart`, payload, {
      headers: this.getHeaders()
    });
  }

  // Update item quantity
  updateQuantity(itemId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart/${itemId}`, { quantity }, {
      headers: this.getHeaders()
    });
  }

  // Remove item from cart
  removeFromCart(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/${itemId}`, {
      headers: this.getHeaders()
    });
  }

  // Clear cart (after checkout)
  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next([]);
  }

  // Get current cart items
  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  // Calculate total payment
  calculateTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
  }

  // Get cart item count
  getItemCount(): number {
    return this.cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  }
}
