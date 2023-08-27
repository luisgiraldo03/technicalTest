import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
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
  public product!: Product;
  public isEditable: Boolean = false;
  public isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.buildForm().then(() => {
      this.route.params.subscribe((product: any) => {
        if (Object.keys(product).length === 0) {
          this.isEditable = false;
        } else {
          this.isEditable = true;
        }
        this.product = product;
        console.log(this.product);

        const d = new Date(this.product.date_release);
        console.log(d);

        if (this.isEditable) {
          this.forma.setValue({
            id: this.product.id,
            description: this.product.description,
            date_release: new Date(this.product.date_release)
              .toISOString()
              .split('T')[0],
            name: this.product.name,
            logo: this.product.logo,
            date_revision: new Date(this.product.date_revision)
              .toISOString()
              .split('T')[0],
          });
        }
      });
    });
  }

  get dateReleaseOption() {
    return this.forma.controls['date_revision'].disable();
  }

  ngOnInit(): void {}

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
    return new Promise((resolve, reject) => {
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
      resolve(true);
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
    this.isLoading = true;
    if (!this.isEditable) {
      this.productService
        .postProduct(this.forma.value)
        .pipe(
          catchError((error) => {
            this.isLoading = false;
            return [];
          })
        )
        .subscribe(() => {
          this.router.navigate(['/products-list']);
          this.isLoading = false;
        });
      this.loadData();
    } else {
      this.productService
        .updateProduct(this.forma.value)
        .pipe(
          catchError((error) => {
            this.isLoading = false;
            return [];
          })
        )
        .subscribe(() => {
          this.router.navigate(['products-list']);
          this.isLoading = false;
        });
      this.loadData();
    }
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
