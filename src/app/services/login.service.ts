import { Login } from './../Models/user.model';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'

  })
};
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  BaseURL: string = "";

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private localStorageService: LocalStorageService,
    @Inject('BASE_URL') baseUrl: string
  ) {
    if (baseUrl == 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:7119/api/Login/';
    }
    else {
      this.BaseURL = baseUrl + 'api/Login/';
    }
  }

  public async GetLogin(login: Login) {
    return this.http.post(this.BaseURL + 'Login', login, httpOptions)
      .pipe(map(
        response => {
          this.localStorageService.store('token', JSON.stringify(response));
          return response;
        }
      ));
  }

  public async GetUserInformation(UID: any): Promise<Observable<UserModel>> {
    return this.http.get<UserModel>(this.BaseURL + 'UserInformation?UID=' + UID, httpOptions);
  }

  public logout() {
    this.localStorageService.clear('token');
    localStorage.clear();
    this.router.navigate(['/login']);

  }


}

export interface UserModel {
  UID: string;
  FULLNAME: string;
  TITLE: string;
  JOBTITLE: string;
  STARTDATE?: Date;
}