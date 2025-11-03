import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component'; // ✅ Import Signup
import { ProductaddformComponent } from './auth/signup/productaddform/productaddform.component'; // ✅ Import Signup
import { OwnerhomeComponent } from './views/ownerhome/ownerhome.component';
import { ManagestockComponent } from './views/managestock/managestock.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' }, // Default route
  { path: 'login', component: LoginComponent }, // Login page
  { path: 'signup', component: SignupComponent }, // Signup page
  { path: 'manageproduct', component: ProductaddformComponent }, // Signup page
  { path: 'ownerhome', component: OwnerhomeComponent }, // Signup page
  { path: 'managestock', component: ManagestockComponent }, // Signup page

  { path: '**', redirectTo: 'login', pathMatch: 'full' } // Wildcard fallback
];
