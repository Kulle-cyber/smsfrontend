import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './user/user.component';
import { AccountantComponent } from './components/accountant/accountant.component';
import { SalespersonComponent } from './components/salesperson/salesperson.component';
import { CustomerManagementComponent } from './components/customer-management/customer-management.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // redirect empty path to login
  { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UserComponent },
      { path: 'accountant', component: AccountantComponent },
  { path: 'salesperson', component: SalespersonComponent },  // route for users
   { path: 'customers', component: CustomerManagementComponent }


      // Add this line

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
