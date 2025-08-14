import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UserCartItem } from '../../Core/common/CommonModels/ProductModel';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);

  private apiUrl: string = environment.baseUrl;

  private getAllNewsLetterUrl: string = 'Newsletter/GetAllNewsLetters';
  private getFeaturedProductUrl: string = 'Product/GetFeaturedProduct';
  private getCartItemsUrl: string = 'Order/GetCartItems';
  private getAllProductsUrl: string = 'Product/GetAllProducts';
  private addOrGetCartItemsUrl: string = 'Order/AddOrGetGetCartItems';
  private orderProductUrl: string = 'Order/OrderProducts';


  constructor() { }

  getNewLetters(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl + this.getAllNewsLetterUrl}`);
  }

  getAllProducts(filterModel: any) {
    return this.http.post<any>(`${this.apiUrl + this.getAllProductsUrl}`, filterModel);
  }
  getFeaturedProduct(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl + this.getFeaturedProductUrl}`);
  }
  addOrGetCartItems(cartItems: UserCartItem[]) {
    return this.http.post(`${this.apiUrl + this.addOrGetCartItemsUrl}`, cartItems);
  }
  getCartItems(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl + this.getCartItemsUrl}`);
  }

  orderProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl + this.orderProductUrl}`);
  }
}
