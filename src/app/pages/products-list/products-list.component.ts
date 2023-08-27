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
  products: Product[] = [];
  filter!: FormGroup;
  isLoading = false;
  pagedRecords: Product[] = [];
  itemsPerPage = 5;
  currentPage = 1;

  constructor(
    private router: Router,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.filter = this.fb.group({
      filter: [''],
    });
  }

  ngOnInit() {
    this.getProducts();
  }

  get filterText() {
    return this.filter.get('filter')?.value.toLowerCase();
  }

  get filteredRecords() {
    return this.products.filter((record) =>
      record.name.toLowerCase().includes(this.filterText)
    );
  }

  get totalItems() {
    return this.filteredRecords.length;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedFilteredRecords() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredRecords.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  getProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe(
      (response: Product[]) => {
        this.products = response;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  goAddProduct() {
    this.router.navigate(['/register']);
  }

  openOptions(product: Product) {
    this.router.navigate(['/register', product]);
  }
}
