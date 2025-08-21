// customer-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/models/cart-item.model';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  quantity?: number;
}

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  cart: CartItem[] = [];
  searchTerm: string = '';
  totalPayment: number = 0;
  cartVisible: boolean = false;
  itemCount: number = 0;

  private apiUrl = 'http://localhost:8889/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.setupCartSubscription();
    this.cartService.fetchCart();
  }

  // Set up subscription to cart changes
  private setupCartSubscription(): void {
    this.cartService.cart$.subscribe(cartItems => {
      this.cart = cartItems;
      this.totalPayment = this.cartService.calculateTotal();
      this.itemCount = this.cartService.getItemCount();
    });
  }

  // Fetch all products
  fetchProducts() {
    this.http.get<Product[]>(`${this.apiUrl}/products/public`).subscribe({
      next: res => {
        this.products = res;
        this.filteredProducts = [...res];
      },
      error: err => console.error('Error fetching products:', err)
    });
  }

  // Search products
  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredProducts = term
      ? this.products.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
        )
      : [...this.products];
  }

  // Toggle cart panel
  toggleCart() {
    this.cartVisible = !this.cartVisible;
  }

  // Add product to cart
  addToCart(product: Product) {
    const customerId = this.authService.getCustomerId();
    if (!customerId) {
      alert('You must be logged in to add items to cart.');
      this.router.navigate(['/login']);
      return;
    }

    const item: CartItem = {
      customerId,
      productId: product.id,
      quantity: 1,
      name: product.name,
      price: product.price,
      image_url: product.image_url
    };

    this.cartService.addToCart(item).subscribe({
      next: () => {
        // Cart service will automatically update via fetchCart()
        this.cartService.fetchCart();
      },
      error: err => {
        console.error('Error adding to cart:', err);
        alert('Failed to add item to cart.');
      }
    });
  }

  // Increase quantity
  increaseQuantity(item: CartItem) {
    if (!item.id) return;

    const newQuantity = (item.quantity || 1) + 1;
    this.cartService.updateQuantity(item.id, newQuantity).subscribe({
      next: () => {
        this.cartService.fetchCart(); // Refresh cart
      },
      error: err => console.error('Error updating quantity:', err)
    });
  }

  // Decrease quantity
  decreaseQuantity(item: CartItem) {
    if (!item.id) return;

    if ((item.quantity || 1) > 1) {
      const newQuantity = (item.quantity || 1) - 1;
      this.cartService.updateQuantity(item.id, newQuantity).subscribe({
        next: () => {
          this.cartService.fetchCart(); // Refresh cart
        },
        error: err => console.error('Error updating quantity:', err)
      });
    } else {
      this.removeFromCart(item);
    }
  }

  // Remove item from cart
  removeFromCart(item: CartItem) {
    if (!item.id) return;

    this.cartService.removeFromCart(item.id).subscribe({
      next: () => {
        this.cartService.fetchCart(); // Refresh cart
      },
      error: err => console.error('Error removing item:', err)
    });
  }

  // Checkout
  checkout() {
    const customerId = this.authService.getCustomerId();
    if (!customerId) {
      alert('You must be logged in to checkout.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);

    const orderPayload = {
      customerId,
      items: this.cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      total: this.totalPayment
    };

    this.http.post(`${this.apiUrl}/orders`, orderPayload, { headers }).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.cartService.clearCart();
        this.cartVisible = false;
      },
      error: err => {
        console.error('Checkout failed:', err);
        alert('Checkout failed. Please try again.');
      }
    });
  }
}
