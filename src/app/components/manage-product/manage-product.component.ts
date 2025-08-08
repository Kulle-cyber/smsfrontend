import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product1.model';
import { Product1Service } from 'src/app/services/product1.service';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  productForm!: FormGroup;
  editing: boolean = false;
  selectedProductId?: number;
  imageFile?: File;
  imagePreview?: string;
  loggedInSalespersonId: number = 123; // Replace with real logged in user ID
  showAddForm: boolean = false;
  searchTerm: string = '';

  constructor(private fb: FormBuilder, private product1Service: Product1Service) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      image_url: ['']
    });
  }

  loadProducts(): void {
    this.product1Service.getAll(this.loggedInSalespersonId).subscribe(data => {
      this.products = data;
      this.filteredProducts = [...this.products];
    });
  }

  filterProducts(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
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
      salesperson_id: this.loggedInSalespersonId
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
    this.imagePreview = product.image_url;
    this.showAddForm = true;
  }

  resetForm(): void {
    this.editing = false;
    this.selectedProductId = undefined;
    this.productForm.reset();
    this.imagePreview = undefined;
    this.imageFile = undefined;
    this.showAddForm = false;
  }
}
