import { ShareService } from '@/Shared/share.service';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LookupService } from '@services/lookup.service';
import { PatientService } from '@services/patient.service';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  @ViewChild('Autofocus') myfield: ElementRef<HTMLInputElement>;

  @Input() public title: string;
  @Output() action = new EventEmitter();
  form: FormGroup;
  submitted = false;
  // public caption: string = 'Save';

  public AllConsultants: Observable<Array<any>>;
  // public AllPatients: Observable<Array<any>>;
  public AllPatients = this.shareService.Contact.asObservable();
  public sex: Observable<Array<any>>;
  public Type: Observable<Array<any>>;

  datePickerConfig: Partial<BsDatepickerConfig>;
  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private interactivityChecker: InteractivityChecker,
    private toastr: ToastrService,
    private patientservice: PatientService,
    private shareService: ShareService,
    private service: LookupService,
    private el: ElementRef
  ) {
    this.Createform();

    this.datePickerConfig = Object.assign({}, {
      // containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      isAnimated: true,
      dateInputFormat: 'DD-MMM-YYYY'

    });
  }

  Createform() {
    this.form = this.fb.group({
      ApptNo: ['', Validators.required],
      ApptDate: [''],
      ApptTime: [''],
      PID: ['', Validators.required],
      Name: ['', Validators.required],
      Sex: [''],
      Age: [''],
      Contact: ['', Validators.required],
      Type: ['', Validators.required],
      Consultant: ['', Validators.required],
    });
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.AllConsultants = this.patientservice.GetAllConsultant();
    this.GetAllPatients();
    this.sex = this.service.GetSex();
    this.Type = this.service.GetPatientType();
    setTimeout(() => {
      this.NewID();
      // this.myfield.nativeElement.focus();
    }, 100);

    this.f.Contact.valueChanges.subscribe((val) => {
      if (val !== '' && val !== null && val !== undefined) {
        if (val.length === 11) {
          this.GetPID(val);
        }
      }
    })

    // this.Patient.get('Contact').valueChanges.subscribe(()=>{
    //   this.GetPatientListBY();
    // })
  }

  public NewID(): void {
    this.submitted = false;
    this.form.reset();

    setTimeout(() => {
      this.myfield.nativeElement.focus();
    }, 100);

    this.f.ApptDate.patchValue(new Date());

    this.patientservice.GetApptNo().subscribe(
      data => this.f.ApptNo.patchValue(data)
    );
    // this.patientservice.GetPID().subscribe(
    //   data => this.f.PID.patchValue(data)
    // );
  }

  public GetAllPatients(): void {
    this.patientservice.GetAllPatients().subscribe({
      next: Val => {
        this.shareService.datastore.data = Val;
        this.shareService.Contact.next(Object.assign({}, this.shareService.datastore).data);
      },
      error: (err) => {
        this.toastr.info(err, 'info');
      }
    });
  }
  public GetPID(val): void {
    this.service.GetPatient(val).subscribe(
      (data: any) => {
        if (data.PID !== null) {

          this.form.patchValue({
            PID: data['PID'],
            Name: data['Name'],
            Sex: data['Sex'],
            Age: data['Age'],
            Type: 'Old',
          });
        } else {
          this.patientservice.GetPID().subscribe(
            data => this.f.PID.patchValue(data)
          );
        }
      },
    );
  }

  public onfocus(form: FormGroup) {
    for (const key of Object.keys(form.controls)) {
      if (form.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
      }
    }
  }

  public Save(): void {
    this.onfocus(this.form);
    this.submitted = true;
    if (!this.form.valid) {
      return;
    }
    Swal.fire({
      title: 'Do you want to save the changes?',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientservice.Save(this.form.value).subscribe({
          next: (res: any) => {
            if (res === true) {
              this.toastr.success('New Patient!', 'User Successful.');
            } else if (res === false) {
              this.toastr.warning('New Patient!', 'Transaction Rollback.');
            }
          },
          error: err => {
            this.toastr.info(err, 'info');
          },
          complete: () => {
            this.submitted = false;
            this.action.emit(this.form.value);
            this.bsModalRef.hide();
          }
        });
      } else if (result.isDenied) {
        this.toastr.info('Changes are not saved!', 'info');
      }
    })
  }

  @HostListener('window:keyup', ['$event']) keyevent(event: any) {
    event.preventDefault();
    const inputs = Array.prototype.slice.call(document.querySelectorAll('input'));
    const controls = [];
    if (Array.isArray(controls) && !controls.length) {
      for (let i = 0; i < inputs.length; i++) {
        if (this.interactivityChecker.isFocusable(inputs[i])) {
          if (inputs[i].id !== 'New') {
            controls.push(inputs[i]);
          }
        }
      }
    }

    if (event.keyCode === 13 || event.keyCode === 40) {
      const control = controls[controls.indexOf(document.activeElement) + 1];
      if (control) {
        control.focus();
        control.select();
      }
    } else if (event.keyCode === 38) {
      const control = controls[controls.indexOf(document.activeElement) - 1];
      if (control) {
        control.focus();
        control.select();
      }
    }
  }


}
