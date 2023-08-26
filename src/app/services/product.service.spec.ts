import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve products from API', () => {
    const mockProducs = [
      {
        id: '1',
        name: 'User 1',
        description: 'asd',
        logo: 'dsfsdf',
        date_release: '20-20-2022',
        date_revision: '20-20-2022',
      },
    ];

    service.getProducts().subscribe((products: any) => {
      expect(products).toEqual(mockProducs);
    });

    const req = httpMock.expectOne(
      'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockProducs);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should save a user via API', () => {
    const newProduct = {
      id: '1',
      name: 'User 1',
      description: 'asd',
      logo: 'dsfsdf',
      date_release: new Date(),
      date_revision: new Date(),
    };

    const mockResponse = { ...newProduct };

    service.postProduct(newProduct).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products'
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
