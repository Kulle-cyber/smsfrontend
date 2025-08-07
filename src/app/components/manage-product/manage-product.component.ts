import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product1.model';
import { Product1Service } from 'src/app/services/product1.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
  products: Product[] = [];
  productForm!: FormGroup;
  editing: boolean = false;
  selectedProductId?: number;

  imageFile?: File;
  imagePreview?: string;

  // TODO: Replace this mock with real auth user info service
  loggedInSalespersonId: number = 123;  // Example logged-in salesperson ID

  constructor(
    private product1Service: Product1Service,
    private fb: FormBuilder
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
      imageUrl: ['']
      // salespersonId removed from form controls
    });
  }

  loadProducts(): void {
  this.product1Service.getAll(this.loggedInSalespersonId).subscribe((data: Product[]) => {
    this.products = data;
  });
}

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.imageFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.productForm.patchValue({ imageUrl: this.imagePreview });
    };
    reader.readAsDataURL(this.imageFile);
  }
}

  onSubmit(): void {
    if (this.productForm.invalid) return;

    // Get form values
    const formValue = this.productForm.value;

    // Add logged in salespersonId automatically
    const product: Product = {
      ...formValue,
      salespersonId: this.loggedInSalespersonId
    };

    if (this.editing && this.selectedProductId != null) {
      this.product1Service.update(this.selectedProductId, product).subscribe(() => {
        this.loadProducts();
        this.resetForm();
      });
    } else {
      this.product1Service.create(product).subscribe(() => {
        this.loadProducts();
        this.resetForm();
      });
    }
  }

  editProduct(product: Product): void {
    this.editing = true;
    this.selectedProductId = product.id;
    this.productForm.patchValue(product);
    this.imagePreview = product.imageUrl;
  }

  deleteProduct(id: number): void {
    this.product1Service.delete(id).subscribe(() => {
      this.loadProducts();
    });
  }

  resetForm(): void {
    this.editing = false;
    this.selectedProductId = undefined;
    this.productForm.reset();
    this.imagePreview = undefined;
    this.imageFile = undefined;
  }
}
