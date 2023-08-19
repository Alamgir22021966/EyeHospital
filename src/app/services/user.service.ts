
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { UserList, UserModel } from '@/Models/user.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'

  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  BaseURL: string = "";

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {

    if (baseUrl == 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:7119/api/User/';
    }
    else {
      this.BaseURL = baseUrl + 'api/User/';
    }
  }

  public GetAllUser(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetAllUser');
  }

  public GetSupplierAutoCompleteData(): Observable<any> {
    return this.http.get<Observable<any>>(this.BaseURL + 'GetSupplierAutoCompleteData');
  }

  public Save(user: UserModel) {
    return this.http.post(this.BaseURL + 'Save', user)
      .pipe(map(
        response => {
          return response;
        }
      ));
  }

  public GetUID(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GeneratedUID');
  }

  public GetUserList(): Observable<UserList> {
    return this.http.get<UserList>(this.BaseURL + 'GetUserList');
  }

  public GetUser(UID: string): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetUserID?UID=' + UID, httpOptions);
  }

  public GetUserInformation(UID: string): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetUserInformation?UID=' + UID, httpOptions);
  }

  public Delete(UID: string): Observable<string> {
    return this.http.get<string>(this.BaseURL + 'Delete?UID=' + UID, httpOptions);
  }

  public roleMatch(allowedRoles: any): boolean {
    var isMatch = false;

    //var payload = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var payload = JSON.parse(localStorage.getItem('token').split('.')[1]);
    console.log(payload);
    //var payload = this.jwtHelper.decodeToken(localStorage.getItem('token').split('.')[1])
    var userRole = payload.Role;
    console.log(userRole);
    allowedRoles.forEach(element => {
      if (userRole == element) {
        isMatch = true;
        return false;
      }

    });
    return isMatch;
  }


}
