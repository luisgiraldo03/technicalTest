import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public rootURL = environment.baseAPI;

  public headers = new HttpHeaders({
    authorId: '4444',
  });

  constructor(private http: HttpClient) {}

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.rootURL}/bp/products`, {
      headers: this.headers,
    });
  }

  public postProduct(body: Product): Observable<Product> {
    return this.http.post<Product>(`${this.rootURL}/bp/products`, body, {
      headers: this.headers,
    });
  }

  public updateProduct(body: Product): Observable<Product> {
    return this.http.put<Product>(`${this.rootURL}/bp/products`, body, {
      headers: this.headers,
    });
  }

  public verifyID(id: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.rootURL}/bp/products/verification?id=${id}`
    );
  }

  public deleteProduct(id: string): Observable<Product> {
    return this.http.delete<Product>(`${this.rootURL}/bp/products?id=${id}`, {
      headers: this.headers,
    });
  }
}
