import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
   
  })
};

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  BaseURL: any = "";

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    if (baseUrl == 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:7119/api/Dashboard/'
    }
    else {
      this.BaseURL = baseUrl + 'api/Dashboard/';
    }
  
  }

  public GetBarChart(Year: string): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetBarChart?Year=' + Year, httpOptions);
  }

  public GetTotalAppointment(params: any): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetTotalAppointment', { params });
  }

  public GetTotalPresent(params: any): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetTotalPresent', { params });
  }
  
  public GetNewPatient(params: any): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetNewPatient', { params });
  }

}
