import { ShareService } from '@/Shared/share.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PatientService } from '@services/patient.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AppointmentComponent } from '../appointment/appointment.component';
import { HttpParams } from '@angular/common/http';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { InvoiceComponent } from '../invoice/invoice.component';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  PatientListForm: FormGroup;
  bsModalRef: BsModalRef;

  public AllPatients = this.shareService.Contact.asObservable();

  public AllPID = this.shareService.AllPID.asObservable();

  public placeholder: string = 'Enter Search String';
  public keyword = 'Name';
  datePickerConfig: Partial<BsDatepickerConfig>;
  constructor(
    private fb: FormBuilder,
    private shareService: ShareService,
    private patientservice: PatientService,
    private toastr: ToastrService,
    private bsModalService: BsModalService,
    private datePipe: DatePipe,
  ) {
    this.Createform();
    this.datePickerConfig = Object.assign({}, {
      // containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      isAnimated: true,
      dateInputFormat: 'DD-MMM-YYYY'

    });
  }

  Createform(): void {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      arr.push(this.ListForm());
    }
    this.PatientListForm = this.fb.group({
      Patient: this.fb.group({
        PID: [''],
        Contact: [''],
        ApptDate: ['']
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
      Consultant: ['']
    });
  }

  get Patient(): any { return this.PatientListForm.get('Patient'); }

  get PatientList(): any {
    return this.PatientListForm.get('PatientList') as FormArray;
  }

  ngOnInit(): void {
    this.GetAllPID();
    this.GetAllPatients();
    this.Patient.get('PID').patchValue('All');
    this.Patient.get('Contact').patchValue('All');
    this.GetPatientList()

    this.Patient.get('PID').valueChanges.subscribe(()=>{
      this.GetPatientListBY();
    })
    this.Patient.get('Contact').valueChanges.subscribe(()=>{
      this.GetPatientListBY();
    })
    this.Patient.get('ApptDate').valueChanges.subscribe(()=>{
      this.GetPatientListBY();
    })

  }

  public GetAllPatients(): void {
    this.patientservice.GetAllPatients().subscribe({
      next: Val => {
        this.shareService.datastore.data = Val;
        this.shareService.Contact.next(Object.assign({}, this.shareService.datastore).data);
        this.shareService.datastore.data.unshift('All');
      },
      error: (err) => {
        this.toastr.info(err, 'info');
      }
    });
  }

  public GetAllPID(): void {
    this.patientservice.GetAllPID().subscribe({
      next: Val => {
        this.shareService.datastore.data = Val;
        this.shareService.AllPID.next(Object.assign({}, this.shareService.datastore).data);
        this.shareService.datastore.data.unshift('All');
      },
      error: (err) => {
        this.toastr.info(err, 'info');
      }
    });
  }

  public Open(): void {
    const initialState = {
      title: 'Patient Information',
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
    };
    this.bsModalRef = this.bsModalService.show(AppointmentComponent, Object.assign({}, { class: 'modal-md', initialState }));
    this.bsModalRef.content.action.subscribe(() => {
      this.GetAllPID();
      this.GetAllPatients();
      this.GetPatientList();
    });
  }

  public GetPatientList() {
    this.patientservice.GetPatientList().subscribe({
      next: (data: any) => {
        console.log(data);
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
            controls.at(+i).get('Consultant').setValue(data[i].Consultant);

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

  public GetPatientListBY() {
    this.PatientList.reset();
    const control = this.PatientListForm.controls['Patient'];
    let params = new HttpParams().appendAll({
      'PID': control.get('PID').value !== 'All' ? control.get('PID').value : 'All',
      'Contact': control.get('Contact').value !== 'All' ? control.get('Contact').value : 'All',
      'ApptDate': control.get('ApptDate').value !== '' && control.get('ApptDate').value !== undefined ? this.datePipe.transform(control.get('ApptDate').value, 'dd/MM/yyyy') : 'All'
    });

    this.patientservice.GetPatientListBY(params).subscribe({
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
            controls.at(+i).get('Consultant').setValue(data[i].Consultant);

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

  public Delete(index: any, ApptNo): void {
    if (ApptNo) {
      Swal.fire({
        title: 'Do you want to delete the record?',
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.patientservice.Delete(ApptNo).subscribe({
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

  openModal(index: any, ApptNo: any, PID: any) {
    this.patientservice.GetPatientInvoice(ApptNo, PID).subscribe((data: any[]) => {
      const initialState = {
        title: 'Invoice',
        data: data,
        ignoreBackdropClick: true,
        animated: true,
        keyboard: true
      };

      this.bsModalRef = this.bsModalService.show(InvoiceComponent, Object.assign({}, { class: 'modal-md', initialState }));

    });
  }

}
