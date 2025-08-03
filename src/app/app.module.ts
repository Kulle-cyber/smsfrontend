import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

// Angular animations (required by ngx-toastr and Angular Material)
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MaterialModule } from './material/material.module';
//import { ReactiveFormsModule, FormsModule } from '@angular/forms';  // <-- import FormsModule here
import { FormsModule } from '@angular/forms';  // <-- add this import
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Toastr module
import { ToastrModule } from 'ngx-toastr';

// Angular Forms
import { ReactiveFormsModule } from '@angular/forms';

// HTTP
import { HttpClientModule } from '@angular/common/http';

// Angular Material modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';  // ✅ ADDED
import { MatMenuModule } from '@angular/material/menu';        // ✅ ADDED

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { UserComponent } from './user/user.component';
import { CustomerManagementComponent } from './components/customer-management/customer-management.component';

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
    CustomerManagementComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
        MaterialModule,  // <---- add here
    FormsModule,          // <-- add FormsModule here

    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
        MatSidenavModule,
    MatCardModule,

      MatListModule,

    MatToolbarModule,   // ✅ Toolbar for navbar
    MatMenuModule,      // ✅ Menu for user dropdown
    ToastrModule.forRoot(),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
