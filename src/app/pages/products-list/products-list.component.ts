import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../models/Product';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  public products: Product[] = [];

  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((response: any) => {
      this.products = response.slice(0, 5);
      console.log(this.products);
    });
  }

  public goAddProduct() {
    this.router.navigate(['/register']);
  }
}
