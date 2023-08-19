import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'

  })
};

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  BaseURL: string = "";

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') baseUrl: string
  ) {
    if (baseUrl == 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:7119/api/Lookup/';
    }
    else {
      this.BaseURL = baseUrl + 'api/Lookup/';
    }
  }

  public GetYears(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetYears', httpOptions);
  }

  public GetMonth(): Observable<any> {
    return of([
      { Value: '00', Name: 'All' },
      { Value: '01', Name: 'Jan' },
      { Value: '02', Name: 'Feb' },
      { Value: '03', Name: 'Mar' },
      { Value: '04', Name: 'Apr' },
      { Value: '05', Name: 'May' },
      { Value: '06', Name: 'Jun' },
      { Value: '07', Name: 'Jul' },
      { Value: '08', Name: 'Aug' },
      { Value: '09', Name: 'Sep' },
      { Value: '10', Name: 'Oct' },
      { Value: '11', Name: 'Nov' },
      { Value: '12', Name: 'Dec' }
    ]);
  }

  public GetAllConsultant(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetAllConsultant');
  }

  public GetPatient(contact: string): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetPatient?contact=' + contact, httpOptions);
  }

  public GetDesignation(): Observable<any> {
    return of([
      'Head of IT',
      'Consultant',
      'Accounts Manager',
      'General Manager',

    ]);
  }
  public GetRoles(): Observable<any> {
    return of([
      'Admin',
      'Consultant',
      'Accounts Manager',
      'General Manager',
      'General User'
    ]);
  }

  public GetSex(): Observable<any> {
    return of([
      'Male',
      'Female'
    ]);
  }
  public GetPatientType(): Observable<any> {
    return of([
      'New',
      'Old'
    ]);
  }

  public GetRoles1(): Observable<any> {
    return of([
      { Value: 'Admin', Name: 'Admin' },
      { Value: 'Territory Manager', Name: 'Territory Manager' },
      { Value: 'Regional Sales Manager', Name: 'Regional Sales Manager' },
      { Value: 'National Sales Manager', Name: 'National Sales Manager' },
      { Value: 'Warehouse', Name: 'Warehouse' },
      { Value: 'Accounts', Name: 'Accounts' },
      { Value: 'General Manager', Name: 'General Manager' },
      { Value: 'Head of Operations', Name: 'Head of Operations' },
      { Value: 'Head of Business Affairs', Name: 'Head of Business Affairs' },
      { Value: 'User', Name: 'User' }
    ]);
  }

}
