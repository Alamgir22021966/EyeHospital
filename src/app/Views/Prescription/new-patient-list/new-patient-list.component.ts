import { ShareService } from '@/Shared/share.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { PrescriptionService } from '@services/prescriptionservice';
import { Observable } from 'rxjs';
import { LookupService } from '@services/lookup.service';

@Component({
  selector: 'app-new-patient-list',
  templateUrl: './new-patient-list.component.html',
  styleUrls: ['./new-patient-list.component.scss']
})
export class NewPatientListComponent {
  PatientListForm: FormGroup;
  isConsultant = false;

  public AllNewPID = this.shareService.AllNewPID.asObservable();
  public AllConsultants = this.shareService.AllConsultants.asObservable();
  public PatientData = this.shareService.PatientData.asObservable();

  constructor(
    private fb: FormBuilder,
    private shareService: ShareService,
    private prescriptionService: PrescriptionService,
    private toastr: ToastrService,
    private lookupService: LookupService,
    private datePipe: DatePipe,
    private router: Router,
  ) {
    this.Createform();

  }

  Createform(): void {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      arr.push(this.ListForm());
    }
    this.PatientListForm = this.fb.group({
      Patient: this.fb.group({
        PID: [''],
        Consultant: ['']
      }),
      PatientList: this.fb.array(arr) as FormArray,
    });
  }

  ListForm(): FormGroup {
    return this.fb.group({
      ApptNo: [''],
      PID: [''],
      Name: [''],
      Sex: [''],
      Age: [''],
      Contact: [''],
      Date: [''],
      Time: [''],
      Type: [''],
      Status: ['']
    });
  }

  get Patient(): any { return this.PatientListForm.get('Patient'); }

  get PatientList(): any {
    return this.PatientListForm.get('PatientList') as FormArray;
  }

  ngOnInit(): void {
    this.GetAllPID();
    this.GetAllConsultant();
    this.Patient.get('PID').patchValue('All');
    this.Patient.get('Consultant').patchValue('All');

    if (localStorage.getItem('CurrentRole') === 'Consultant') {
      this.isConsultant = true;
    }

    this.GetNewPatientList();

    this.Patient.get('PID').valueChanges.subscribe(() => {
      this.GetNewPatientList();
    })
    this.Patient.get('Consultant').valueChanges.subscribe(() => {
      this.GetNewPatientList();
      this.GetAllPID();
    })
  }

  public GetAllPID(): void {
    const control = this.PatientListForm.controls['Patient'];
    let params;
    if (localStorage.getItem('CurrentRole') === 'Consultant') {
      params = new HttpParams().appendAll({
        'Consultant': localStorage.getItem('Consultant'),
        'ApptDate': this.datePipe.transform(new Date(), 'dd/MM/yyyy')

      });
    } else {
      params = new HttpParams().appendAll({
        'Consultant': control.get('Consultant').value !== 'All' ? control.get('Consultant').value : 'All',
        'ApptDate': this.datePipe.transform(new Date(), 'dd/MM/yyyy')

      });
    }
    this.prescriptionService.GetAllPID(params).subscribe({
      next: Val => {
        this.shareService.datastore.data = Val;
        this.shareService.AllNewPID.next(Object.assign({}, this.shareService.datastore).data);
        this.shareService.datastore.data.unshift('All');
      },
      error: (err) => {
        this.toastr.info(err, 'info');
      }
    });

  }

  public GetAllConsultant(): void {
    this.lookupService.GetAllConsultant().subscribe({
      next: Val => {
        this.shareService.datastore.data = Val;
        this.shareService.AllConsultants.next(Object.assign({}, this.shareService.datastore).data);
        this.shareService.datastore.data.unshift('All');
      },
      error: (err) => {
        this.toastr.info(err, 'info');
      }
    });
  }

  public GetNewPatientList() {
    this.PatientList.reset();
    const control = this.PatientListForm.controls['Patient'];
    let params;
    if (localStorage.getItem('CurrentRole') === 'Consultant') {
      params = new HttpParams().appendAll({
        'PID': control.get('PID').value !== 'All' ? control.get('PID').value : 'All',
        'Consultant': localStorage.getItem('Consultant'),
        'ApptDate': this.datePipe.transform(new Date(), 'dd/MM/yyyy')

      });
    } else {
      params = new HttpParams().appendAll({
        'PID': control.get('PID').value !== 'All' ? control.get('PID').value : 'All',
        'Consultant': control.get('Consultant').value !== 'All' ? control.get('Consultant').value : 'All',
        'ApptDate': this.datePipe.transform(new Date(), 'dd/MM/yyyy')

      });
    }


    this.prescriptionService.GetNewPatientList(params).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          const controls = this.PatientListForm.controls['PatientList'] as FormArray;
          for (let i = 0; i < data.length; i++) {
            controls.at(+i).get('ApptNo').setValue(data[i].ApptNo);
            controls.at(+i).get('PID').setValue(data[i].PID);
            controls.at(+i).get('Name').setValue(data[i].Name);
            controls.at(+i).get('Sex').setValue(data[i].Sex);
            controls.at(+i).get('Age').setValue(data[i].Age);
            controls.at(+i).get('Contact').setValue(data[i].Contact);
            controls.at(+i).get('Date').setValue(this.datePipe.transform(data[i].ApptDate, 'dd-MMM-yyyy'));
            controls.at(+i).get('Time').setValue(data[i].ApptTime);
            controls.at(+i).get('Type').setValue(data[i].Type);
            controls.at(+i).get('Status').setValue(data[i].Status);

            if (i >= 14 && i < data.length - 1) {
              this.PatientList.push(this.ListForm());
            }
          }
        }
      },
      error: (err) => {
        this.toastr.warning(err);
      }
    });
  }

  public Delete(index: any, PID: any): void {
    if (PID) {
      Swal.fire({
        title: 'Do you want to delete the record?',
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.prescriptionService.Delete(PID).subscribe({
            next: (res: any) => {
              if (res === true) {
                this.toastr.warning("Deleted Successfully", "Delete Information");
              } else if (res === false) {
                this.toastr.warning("Transaction Rollback", "Delete Information");
              }
            },
            error: (err: any) => {
              console.log(err);
              this.toastr.info(err, 'info');
            },
            complete: () => {
              this.RemoveDeleteItem(index);
            }
          });
        } else if (result.isDenied) {
          this.toastr.info('Record are not deleted!', 'info');
        }
      })
    }
  }

  public RemoveDeleteItem(index): void {
    this.PatientList.removeAt(index);
    this.PatientList.push(this.ListForm());
  }

  openModal(index: any, ApptNo, PID: any) {
    this.prescriptionService.GetPatientPrescription(ApptNo, PID).subscribe(
      (val: any[]) => {
        this.shareService.datastore.data = val;
        this.shareService.PatientData.next(Object.assign({}, this.shareService.datastore).data);
        this.router.navigate(['/home/Prescription/Prescription']);

      });
  }




}
