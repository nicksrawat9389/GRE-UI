import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl: string = environment.baseUrl;


  private changeUserNameUrl: string = 'User/ChangeUserName';
  private changePasswordUrl: string = 'User/ChangeUserPassword';

  constructor() { }


  changeUserName(user:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.changeUserNameUrl}`,user);
  }

  changePassword(passwordObject:any) : Observable<any>{
        return this.http.post<any>(`${this.apiUrl + this.changePasswordUrl}`,passwordObject);

  }




}
