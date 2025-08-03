import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss']
})
export class CustomerManagementComponent implements OnInit {
  customerForm: FormGroup;
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  editMode = false;
  editingCustomer: Customer | null = null;
  searchTerm = '';
  showForm = false;

  constructor(private fb: FormBuilder, private customerService: CustomerService) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: [''],
      address: [''],
      portalAccess: [false],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.filteredCustomers = [...data];
      },
      error: (err) => {
        console.error('Error loading customers:', err);
      }
    });
  }

  get totalCustomers(): number {
    return this.customers.length;
  }

  get portalCustomerCount(): number {
    return this.customers.filter(c => c.portalAccess).length;
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCustomers = this.customers.filter(c =>
      c.name.toLowerCase().includes(term) ||
      (c.email && c.email.toLowerCase().includes(term))
    );
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.cancelEdit();
    }
  }

  editCustomer(customer: Customer) {
    this.editMode = true;
    this.showForm = true;
    this.editingCustomer = customer;
    this.customerForm.patchValue({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      portalAccess: customer.portalAccess,
      password: ''
    });
  }

  cancelEdit() {
    this.editMode = false;
    this.showForm = false;
    this.editingCustomer = null;
    this.customerForm.reset({
      portalAccess: false
    });
  }

  onSubmit() {
    if (this.customerForm.invalid) {
      this.markFormGroupTouched(this.customerForm);
      return;
    }

    const formData = this.customerForm.value;

    if (formData.portalAccess && !this.editMode && !formData.password) {
      alert('Password is required for portal access');
      return;
    }

    if (this.editMode && this.editingCustomer) {
      // For edit, remove password if not changed
      if (!formData.password) {
        delete formData.password;
      }

      this.customerService.updateCustomer({
        ...formData,
        id: this.editingCustomer.id
      }).subscribe({
        next: () => {
          this.loadCustomers();
          this.cancelEdit();
        },
        error: (err) => {
          console.error('Error updating customer:', err);
        }
      });
    } else {
      // For new customer
      this.customerService.registerCustomer(formData).subscribe({
        next: () => {
          this.loadCustomers();
          this.cancelEdit();
        },
        error: (err) => {
          console.error('Error creating customer:', err);
        }
      });
    }
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (err) => {
          console.error('Error deleting customer:', err);
        }
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
