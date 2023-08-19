import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

export interface Lookup {
  Value: string;
  Name: string;
}
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'jwt-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  public YEAR: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public MONTH: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public User: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public Contact: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public AllPID: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public AllNewPID: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public PatientData: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public AllConsultants: BehaviorSubject<any[]> = new BehaviorSubject([]);

  public datastore: { data:any } = { data: [] };
  // public ConsultantData: { data:any } = { data: [] };

  constructor(
  ) {

  }





}
