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
export class PrescriptionService {
  BaseURL: string = "";
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) { 
    if (baseUrl == 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:7119/api/Prescription/';
    }
    else {
      this.BaseURL = baseUrl + 'api/Prescription/';
    }
  }
  public GetAllPID(params: any): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetAllPID', { params });
  }

  public GetNewPatientList(params: any): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetNewPatientList', { params });
  } 

  public GetPatientPrescription(ApptNo: string, PID: string): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetPatientPrescription?ApptNo=' + ApptNo + '&PID=' + PID, httpOptions);
  }

  public Save(Prescription: any) {
    return this.http.post(this.BaseURL + 'Save', Prescription)
      .pipe(map(
        response => {
          return response;
        }
      ));
  }

  // public Update(patient: any) {
  //   return this.http.post(this.BaseURL + 'Update', patient)
  //     .pipe(map(
  //       response => {
  //         return response;
  //       }
  //     ));
  // }

  public Delete(ApptNo: string): Observable<string> {
    return this.http.get<string>(this.BaseURL + 'Delete?ApptNo=' + ApptNo, httpOptions);
  }

}
