import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { catchError } from 'rxjs';
import { Product } from '../models/Product';

@Component({
  selector: 'app-product-register',
  templateUrl: './product-register.component.html',
  styleUrls: ['./product-register.component.scss'],
})
export class ProductRegisterComponent implements OnInit {
  public forma: FormGroup;
  public dateDefault!: Date;
  public product!: Product;
  public isEditable: boolean = false;
  public isLoading: boolean = false;

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
        this.setDateDefaults();
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

  ngOnInit(): void {}

  get control() {
    return this.forma.controls;
  }

  public buildForm(): FormGroup {
    return this.fb.group({
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
  }

  public setDateDefaults() {
    const releaseDate = new Date(this.product.date_release);
    this.dateDefault = new Date(releaseDate);
    this.dateDefault.setDate(this.dateDefault.getDate() + 366);
  }

  public setFormValues() {
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

  public setDate(event: any) {
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
    const productMethod = this.isEditable
      ? this.productService.updateProduct(this.forma.value)
      : this.productService.postProduct(this.forma.value);

    productMethod.pipe(catchError(() => [])).subscribe(() => {
      this.router.navigate(['/products-list']);
      this.isLoading = false;
      this.loadData();
    });
  }

  public loadData() {
    this.forma.reset();
  }
}
