import { PatientModel } from '@/models/patient.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'

  })
};
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  BaseURL: string = "";
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) { 
    if (baseUrl == 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:7119/api/Patient/';
    }
    else {
      this.BaseURL = baseUrl + 'api/Patient/';
    }
  }

  public GetAllPID(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetAllPID');
  }

  public GetAllPatients(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetAllPatients');
  }

  public GetAllConsultant(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetAllConsultant');
  }
  
  public GetApptNo(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GeneratedApptNo');
  }

  public GetPID(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GeneratedPID');
  }

  public GetPatientList(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetPatientList');
  }

  public GetNewPatientList(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetNewPatientList');
  }

  public GetPatientInvoice(ApptNo, PID: string): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetPatientInvoice?ApptNo=' + ApptNo + '&PID=' + PID, httpOptions);
  }

  public GetPatientListBY(params: any): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetPatientListBY', { params });
  }  
  public GetNewPatientListBY(params: any): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetNewPatientListBY', { params });
  } 

  public Save(patient: PatientModel) {
    return this.http.post(this.BaseURL + 'Save', patient)
      .pipe(map(
        response => {
          return response;
        }
      ));
  }

  public Update(patient: any) {
    return this.http.post(this.BaseURL + 'Update', patient)
      .pipe(map(
        response => {
          return response;
        }
      ));
  }

  public Delete(ApptNo: string): Observable<string> {
    return this.http.get<string>(this.BaseURL + 'Delete?ApptNo=' + ApptNo, httpOptions);
  }

}
