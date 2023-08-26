import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductRegisterComponent } from './pages/product-register/product-register.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';

const routes: Routes = [
  { path: 'register', component: ProductRegisterComponent },
  { path: 'products-list', component: ProductsListComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'products-list' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
