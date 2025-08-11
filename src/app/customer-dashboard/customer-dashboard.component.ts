import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../models/customer.model';

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
  selector: 'app-products',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss'],
})
export class CustomerDashboardComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<Product[]>('/api/products/public').subscribe(data => {
      this.products = data;
      this.filteredProducts = data; // Initially show all products
    });
  }

  onProductClick(product: Product) {
    alert('You need to buy these');
  }

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    } else {
      this.filteredProducts = this.products;
    }
  }
}
