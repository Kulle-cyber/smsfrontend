import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  salesperson_id: number;
}

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss'],
})
export class CustomerDashboardComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';

  cart: Product[] = [];
  totalPayment: number = 0;

  // Use full backend URL
  backendUrl = 'http://localhost:8889';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
  }

  // Load products from backend
  loadProducts() {
    this.http.get<Product[]>(`${this.backendUrl}/api/products/public`).subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      (err) => console.error('Failed to load products', err)
    );
  }

  // Search filter
  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      this.filteredProducts = this.products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    } else {
      this.filteredProducts = this.products;
    }
  }

  // Add product to cart
  addToCart(product: Product) {
    this.cart.push(product);
    this.calculateTotal();
  }

  // Calculate total payment
  calculateTotal() {
    this.totalPayment = this.cart.reduce((sum, p) => sum + p.price, 0);
  }

  // Checkout and send order to backend
  checkout() {
    const customerId = 1; // TODO: replace with logged-in customerId

    const payload = {
      customerId: customerId,
      totalAmount: this.totalPayment,
      items: this.cart.map((p) => ({
        productId: p.id,
        salespersonId: p.salesperson_id,
        quantity: 1,
        price: p.price,
      })),
    };

    this.http
      .post(`${this.backendUrl}/api/cart/checkout`, payload)
      .subscribe({
        next: (res: any) => {
          alert('Payment successful! Order ID: ' + res.orderId);
          this.cart = [];
          this.totalPayment = 0;
        },
        error: (err) => {
          console.error('Checkout failed', err);
          alert('Checkout failed: ' + (err.error?.message || err.message));
        },
      });
  }
}
