import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from 'src/app/services/product.service';
import { catchError, Subscription } from 'rxjs';

@Component({
  selector: 'app-product-register',
  templateUrl: './product-register.component.html',
  styleUrls: ['./product-register.component.scss'],
})
export class ProductRegisterComponent {
  public forma!: FormGroup;
  public dateDisabled = true;
  public dateDefault: any;
  public prueba = 'hola';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.buildForm();
    this.loadData();
  }

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
      this.forma.get('dateRelease')?.invalid &&
      this.forma.get('dateRelease')?.touched
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
    this.setYearDate();
  }

  public setYearDate() {
    this.forma.get('date_release')?.valueChanges.subscribe((value: string) => {
      if (value !== '') {
        this.dateDefault = new Date(value);
        this.dateDefault.setDate(this.dateDefault.getDate() + 366);
        this.forma
          .get('date_revision')
          ?.setValue(this.dateDefault.toISOString().split('T')[0]);
      } else {
        this.forma.get('date_revision')?.setValue('');
      }
    });
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
