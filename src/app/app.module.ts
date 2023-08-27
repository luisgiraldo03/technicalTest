import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductRegisterComponent } from './pages/product-register/product-register.component';
import { SpinnerComponent } from './utils/spinner/spinner.component';

@NgModule({
  declarations: [AppComponent, ProductsListComponent, ProductRegisterComponent, SpinnerComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
