import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../enviroments/enviroment';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  baseUrl = enviroment.baseUrl;

  constructor(private http: HttpClient) { }
  getProducts(index: number) {
    return this.http.get<any>(`${this.baseUrl}/products/${index}`).pipe(
      catchError(error => {
        console.error('Error fetching product:', error);
        return throwError(error);
      })
    );
  }
  
    newProduct(product: any) {
      return this.http.post<any>(`${this.baseUrl}/products`, product, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).pipe(
        catchError(error => {
          console.error('Error adding product:', error);
          return throwError(error);
        })
      );
    }

    deleteProduct(id: number){
      return this.http.delete<any>(`${this.baseUrl}/products/${id}`).pipe(
        catchError(error => {
          console.error('Error deleting product:', error);
          return throwError(error);
        })
      )
    }

    updateProduct(id: number, product: any) {
      return this.http.put<any>(`${this.baseUrl}/products/${id}`, product,{
        headers: {
          'Content-Type': 'application/json'
        }
      }).pipe(
        catchError(error => {
          console.error('Error updating product:', error);
          return throwError(error);
        })
      );
    }
    
}