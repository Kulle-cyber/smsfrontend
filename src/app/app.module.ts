import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select'; // Add this
import { MatTableModule } from '@angular/material/table'; // Add this
import { MatPaginatorModule } from '@angular/material/paginator'; // Recommended
import { MatSortModule } from '@angular/material/sort'; // Recommended

// Components
import { LoginComponent } from './pages/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { UserComponent } from './user/user.component';
import { CustomerManagementComponent } from './components/customer-management/customer-management.component';
import { SalespersonComponent } from './components/salesperson/salesperson.component';
import { AccountantComponent } from './components/accountant/accountant.component';
//import { ProductsComponent } from './products/products.component';
import { ManageProductComponent } from './components/manage-product/manage-product.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    SidebarComponent,
    DashboardComponent,
    UsersListComponent,
    UserEditComponent,
    UserComponent,
    CustomerManagementComponent,
    SalespersonComponent,
    AccountantComponent,
    //ProductsComponent,
    ManageProductComponent,
    CustomerDashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    AppRoutingModule,

    // Angular Material Modules
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatCardModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatSelectModule, // Added
    MatTableModule, // Added
    MatPaginatorModule, // Added
    MatSortModule // Added
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
