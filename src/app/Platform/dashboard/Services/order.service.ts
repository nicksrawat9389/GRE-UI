import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  private apiUrl: string = environment.baseUrl;

  private getOrderHistoryUrl: string = 'Order/OrderHistory';


  constructor() { }




  getOrderHistory(filterModel:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.getOrderHistoryUrl}`, filterModel);
  }

}
