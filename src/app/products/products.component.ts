import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productForm!: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      categoryId: [null],
      salespersonId: [null]
    });
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const product: Product = this.productForm.value;

    this.productService.addProduct(product).subscribe({
      next: (res) => {
        alert('Product added successfully!');
        this.productForm.reset();
      },
      error: (err) => {
        alert('Failed to add product');
        console.error(err);
      }
    });
  }
}
