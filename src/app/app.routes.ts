import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdminCategoryComponent } from './components/admin-category/admin-category.component';
import { AdminAuthGuard, AuthGuard } from './guards/auth.guard';
import { AddProductComponent } from './components/add-product/add-product.component';
import { HomeComponent } from './components/home/home.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [AuthGuard] },
    { path: 'admin/categories', component: AdminCategoryComponent, canActivate: [AdminAuthGuard], data: { roles: ['admin'] }},
    { path: 'admin/products', component: AddProductComponent, canActivate: [AdminAuthGuard], data: { roles: ['admin'] }},
    { path: 'product/:id', component: ProductDetailsComponent},
    // { path: 'cart', component: },
    // { path: 'admin-access', component: AdminAccessComponent},
    // { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

export const AppRoutingModule = RouterModule.forRoot(routes);