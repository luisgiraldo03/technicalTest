import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductService } from 'src/app/services/product.service';
import { Subscription, catchError } from 'rxjs';
import { Product } from '../models/Product';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-product-register',
  templateUrl: './product-register.component.html',
  styleUrls: ['./product-register.component.scss'],
})
export class ProductRegisterComponent implements OnInit {
  public forma!: FormGroup;
  public dateDisabled = true;
  public dateDefault: any;
  public prueba = 'hola';
  public product!: Product;
  public isEditable: Boolean = false;
  subscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.buildForm();
    this.loadData();
    // this.route.params.subscribe((product: any) => {
    //   this.product = product;
    //   this.isEditable = true;
    //   console.log(this.product);

    //   const d = new Date(this.product.date_release);
    //   console.log(d);

    //   if (this.isEditable) {
    //     this.forma.setValue({
    //       id: this.product.id,
    //       description: this.product.description,
    //       date_release: '',
    //       name: this.product.name,
    //       logo: this.product.logo,
    //       date_revision: '',
    //     });
    //   }
    // });
  }

  ngOnInit() {}

  get notValidId() {
    return this.forma.get('id')?.invalid && this.forma.get('id')?.touched;
  }

  get notValidDescription() {
    return (
      this.forma.get('description')?.invalid &&
      this.forma.get('description')?.touched
    );
  }

  get notValidDateRelease() {
    return (
      this.forma.get('date_release')?.invalid &&
      this.forma.get('date_release')?.touched
    );
  }

  get notValidName() {
    return this.forma.get('name')?.invalid && this.forma.get('name')?.touched;
  }

  get notValidLogo() {
    return this.forma.get('logo')?.invalid && this.forma.get('logo')?.touched;
  }

  public buildForm() {
    this.forma = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(10),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ],
      ],
      date_release: ['', [Validators.required]],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      logo: ['', [Validators.required]],
      date_revision: ['', [Validators.required]],
    });
  }

  setDate(event: any) {
    const valueDate = event.target.value;
    if (valueDate !== '') {
      this.dateDefault = new Date(valueDate);
      this.dateDefault.setDate(this.dateDefault.getDate() + 366);
      this.forma
        .get('date_revision')
        ?.setValue(this.dateDefault.toISOString().split('T')[0]);
    } else {
      this.forma.get('date_revision')?.setValue('');
    }
  }

  public saveProduct() {
    this.productService
      .postProduct(this.forma.value)
      .pipe(
        catchError((error) => {
          console.error(error);
          return [];
        })
      )
      .subscribe(() => {
        this.router.navigate(['/products-list']);
      });
    this.loadData();
  }

  public loadData() {
    this.forma.reset({
      id: '',
      description: '',
      date_release: '',
      name: '',
      logo: '',
      date_revision: '',
    });
  }
}
