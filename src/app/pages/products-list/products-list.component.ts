import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  public goAddProduct() {
    this.router.navigate(['/register']);
  }
}
