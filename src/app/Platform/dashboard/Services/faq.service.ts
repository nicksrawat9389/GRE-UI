import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
 private http = inject(HttpClient);

  private apiUrl: string = environment.baseUrl;

  private getAllFaqUrl: string = 'Faq';
  constructor() { }
  
  getAllFaqs(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl + this.getAllFaqUrl}`);
    }

}
