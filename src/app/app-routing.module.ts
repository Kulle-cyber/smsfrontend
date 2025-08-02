import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './user/user.component';          // import user component

import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // redirect empty path to login
  { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UserComponent }         // route for users
 // Add this line

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
