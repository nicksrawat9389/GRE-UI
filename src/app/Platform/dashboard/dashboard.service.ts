import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
private http = inject(HttpClient);
private router = inject(Router);

  private apiUrl: string = environment.baseUrl;

  private getAllNewsLetterUrl: string = 'Newsletter/GetAllNewsLetters';
  private getFeaturedProductUrl: string = 'Product/GetFeaturedProduct';
  constructor() { }

  getNewLetters():Observable<any>{
    return this.http.get<any>(`${this.apiUrl+this.getAllNewsLetterUrl}`);
  }

  getFeaturedProduct(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl+this.getFeaturedProductUrl}`);
  } 
}
