import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ProductRegisterComponent } from './product-register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

describe('ProductRegisterComponent', () => {
  let component: ProductRegisterComponent;
  let fixture: ComponentFixture<ProductRegisterComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductRegisterComponent],
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRegisterComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when form is empty', () => {
    expect(component.forma.valid).toBeFalsy();
  });

  it('should requires fields', () => {
    const id = component.forma.controls['id'];
    const name = component.forma.controls['name'];
    const description = component.forma.controls['description'];
    const dateRel = component.forma.controls['date_release'];
    const dateRev = component.forma.controls['date_revision'];
    const logo = component.forma.controls['logo'];

    expect(id.valid).toBeFalsy();
    expect(name.valid).toBeFalsy();
    expect(description.valid).toBeFalsy();
  });
});
