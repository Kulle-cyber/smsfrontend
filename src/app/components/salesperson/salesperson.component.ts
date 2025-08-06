import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salesperson',
  templateUrl: './salesperson.component.html',
  styleUrls: ['./salesperson.component.scss']
})
export class SalespersonComponent {
  activeMenu: string = 'create-orders';

  constructor(private router: Router) {}

  setActive(menu: string) {
    this.activeMenu = menu;
  }

  getActiveMenuTitle(): string {
    switch (this.activeMenu) {
      case 'create-orders': return 'Create Orders';
      case 'manage-customers': return 'Manage Own Customers';
      case 'update-stock': return 'Update Product Stock';
      case 'manage-product': return 'Manage Product';
      case 'view-orders': return 'View Own Orders';
      default: return '';
    }
  }

  navigateToCreateProduct() {
    this.router.navigate(['/products/new']);
  }

  navigateToManageProduct() {
    this.router.navigate(['/products/manage']);
  }
}
