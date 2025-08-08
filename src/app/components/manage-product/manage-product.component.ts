import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Product } from 'src/app/models/product1.model';
import { Product1Service } from 'src/app/services/product1.service';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss'],
})
export class ManageProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  productForm!: FormGroup;

  editing = false;
  selectedProductId?: number;

  imageFile?: File;
  imagePreview?: string;

  searchTerm: string = '';
  showAddForm: boolean = false;

  // Example logged-in salesperson ID (replace with real auth logic)
  loggedInSalespersonId: number = 123;

  constructor(
    private fb: FormBuilder,
    private product1Service: Product1Service
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
      stock: [0, Validators.required],
      image_url: [''],
    });
  }

  loadProducts(): void {
    this.product1Service
      .getAll(this.loggedInSalespersonId)
      .subscribe((data: Product[]) => {
        this.products = data;
        this.filteredProducts = data;
      });
  }

  filterProducts(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter((p) =>
        p.name.toLowerCase().includes(term)
      );
    }
  }

  openAddForm(): void {
    this.resetForm();
    this.showAddForm = true;
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.resetForm();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.productForm.patchValue({ image_url: this.imagePreview });
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const formValue = this.productForm.value;

    const product: Product = {
      ...formValue,
      salesperson_id: this.loggedInSalespersonId,
    };

    if (this.editing && this.selectedProductId != null) {
      this.product1Service
        .update(this.selectedProductId, product)
        .subscribe(() => {
          this.loadProducts();
          this.cancelForm();
        });
    } else {
      this.product1Service.create(product).subscribe(() => {
        this.loadProducts();
        this.cancelForm();
      });
    }
  }

  editProduct(product: Product): void {
    this.editing = true;
    this.selectedProductId = product.id;
    this.productForm.patchValue(product);
    this.imagePreview = product.image_url;
    this.showAddForm = true;
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.product1Service.delete(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  resetForm(): void {
    this.editing = false;
    this.selectedProductId = undefined;
    this.productForm.reset();
    this.imagePreview = undefined;
    this.imageFile = undefined;
  }
}
