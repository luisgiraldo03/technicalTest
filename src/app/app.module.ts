import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductRegisterComponent } from './pages/product-register/product-register.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsListComponent,
    ProductRegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
