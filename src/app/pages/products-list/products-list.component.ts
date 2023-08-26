import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, switchMap } from 'rxjs';

import { ProductService } from 'src/app/services/product.service';
import { Product } from '../models/Product';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  public products: Product[] = [];
  public filter!: FormGroup;
  public clicked: boolean = false;

  constructor(
    private router: Router,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.filter = this.fb.group({
      filter: [''],
    });
  }

  get filterText() {
    return this.filter.get('filter')?.value;
  }

  ngOnInit() {
    this.getProducts();
  }

  public getProducts() {
    this.productService.getProducts().subscribe((response: any) => {
      this.products = response.slice(0, 5);
      console.log(this.products);
    });
  }

  get filteredItems() {
    return this.products.filter((item: Product) =>
      item.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  public deleteProduct(id: string) {
    this.productService
      .verifyID(id)
      .pipe(
        catchError((error) => {
          console.error(error);
          return [];
        })
      )
      .subscribe((response) => {
        if (response) {
          this.productService.deleteProduct(id).subscribe();
        }
      });
  }

  public goAddProduct() {
    this.router.navigate(['/register']);
  }

  public openOptions() {
    if (this.clicked) {
      this.clicked = false;
    } else {
      this.clicked = true;
    }
  }
}
