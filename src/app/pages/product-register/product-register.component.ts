import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { catchError, switchMap, tap } from 'rxjs';
import { Product } from '../../models/Product';

@Component({
  selector: 'app-product-register',
  templateUrl: './product-register.component.html',
  styleUrls: ['./product-register.component.scss'],
})
export class ProductRegisterComponent {
  forma: FormGroup;
  dateDefault!: Date;
  product!: Product;
  isEditable: boolean = false;
  isLoading: boolean = false;
  isDisabled: boolean = false;
  defaultImage = '../../../assets/images/Banco_Pichincha_logo.svg.png';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.forma = this.buildForm();
    this.route.params.subscribe((product: any) => {
      this.isEditable = Object.keys(product).length !== 0;
      this.product = product;

      if (this.isEditable) {
        this.setFormValues();
      }
    });
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

  get notValidName() {
    return this.forma.get('name')?.invalid && this.forma.get('name')?.touched;
  }

  get notValidLogo() {
    return this.forma.get('logo')?.invalid && this.forma.get('logo')?.touched;
  }

  get control() {
    return this.forma.controls;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
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
      date_release: [new Date(), [Validators.required]],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      logo: ['', [Validators.required]],
      date_revision: [new Date(), [Validators.required]],
    });
  }

  setFormValues() {
    const { id, description, date_release, name, logo, date_revision } =
      this.product;
    this.forma.setValue({
      id,
      description,
      date_release: new Date(date_release).toISOString().split('T')[0],
      name,
      logo,
      date_revision: new Date(date_revision).toISOString().split('T')[0],
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

  saveProduct() {
    this.isLoading = true;
    const productMethod = this.isEditable
      ? this.productService.updateProduct(this.forma.value)
      : this.productService.postProduct(this.forma.value);

    productMethod
      .pipe(
        tap(() => {
          this.router.navigate(['/products-list']);
          this.loadData();
        }),
        catchError(() => {
          alert('Algo salío mal');
          return [];
        })
      )
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  deleteProduct() {
    const productId = this.forma.get('id')?.value;

    this.productService
      .verifyID(productId)
      .pipe(
        catchError((error) => {
          alert('ID no existe');
          throw error;
        }),
        switchMap((response) => {
          if (response) {
            return this.productService.deleteProduct(productId).pipe(
              catchError((error) => {
                alert('Error al eliminar el producto');
                throw error;
              })
            );
          } else {
            return [];
          }
        })
      )
      .subscribe(() => {
        alert('Eliminado');
      });
  }

  loadData() {
    this.forma.reset();
  }
}
