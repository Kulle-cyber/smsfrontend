import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './user/user.component';
import { AccountantComponent } from './components/accountant/accountant.component';
import { SalespersonComponent } from './components/salesperson/salesperson.component';
import { CustomerManagementComponent } from './components/customer-management/customer-management.component';
import { ManageProductComponent } from './components/manage-product/manage-product.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
//import { AddProductComponent } from './components/add-product/add-product.component'; // stub component

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UserComponent },
  { path: 'accountant', component: AccountantComponent },
  { path: 'salesperson', component: SalespersonComponent },

  { path: 'customer-dashboard', component: CustomerDashboardComponent },
  //{ path: 'customer-dashboard/add-product', component: AddProductComponent },  // Added stub

  { path: 'products/manage', component: ManageProductComponent },
  { path: 'customers', component: CustomerManagementComponent },

  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
