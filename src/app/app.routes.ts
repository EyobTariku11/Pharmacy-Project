import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component'; // ✅ Import Signup
import { ProductaddformComponent } from './auth/signup/productaddform/productaddform.component'; // ✅ Import Signup
import { OwnerhomeComponent } from './views/ownerhome/ownerhome.component';
import { ManagestockComponent } from './views/managestock/managestock.component';
import { CustomerComponent } from './views/customer/customer.component';
import { PharmaListComponent } from './views/customer/pharma-list/pharma-list.component'; 
import { AdminComponent } from './views/admin/admin.component'; 
import { ExploreMedicineComponent } from './views/customer/explore-medicine/explore-medicine.component'; 
import { LandingComponent } from './views/landing/landing.component'; 

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' }, // Default route
  { path: 'login', component: LoginComponent }, // Login page
  { path: 'signup', component: SignupComponent }, // Signup page
  { path: 'manageproduct', component: ProductaddformComponent }, // Signup page
  { path: 'ownerhome', component: OwnerhomeComponent }, // Signup page
  { path: 'managestock', component: ManagestockComponent }, // Signup page
  { path: 'customer',component:CustomerComponent},
  { path: 'pharma-list',component:PharmaListComponent},
  { path: 'admin',component:AdminComponent},
  {path: 'explore-medicine',component:ExploreMedicineComponent},
  {path: 'landing',component:LandingComponent},

  { path: '**', redirectTo: 'login', pathMatch: 'full' } // Wildcard fallback
];
