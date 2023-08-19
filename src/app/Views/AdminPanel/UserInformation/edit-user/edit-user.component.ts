import { UserList } from '@/Models/user.model';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LookupService } from '@services/lookup.service';
import { UserService } from '@services/user.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  datePickerConfig: Partial<BsDatepickerConfig>;
  UserEditForm: FormGroup;
  submitted = false;

  @Input() public title: string;
  @Input() data: any[] = [];
  public userList: UserList;
  @Output() action = new EventEmitter();

  // public Regions = [];
  // public Territories = [];
  public Roles: Observable<Array<any>>;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private bsModalService: BsModalService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private interactivityChecker: InteractivityChecker,
    private lookupService: LookupService,
    private userService: UserService) {
    this.CreateUserForm();

    this.datePickerConfig = Object.assign({}, {
      // containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      isAnimated: true,
      dateInputFormat: 'DD-MMM-YYYY',
      todayHighlight: true
    });
  }

  ngOnInit() {
    this.GetModalData();
    // this.GetRegion();
    this.Roles = this.lookupService.GetRoles();
  }
  CreateUserForm() {
    this.UserEditForm = this.fb.group({
      UID: [''],
      UserName: [''],
      Designation: [''],
      Degrees: ['', this.NoDoubleSpaceAllowed],
      Mobile: [''],
      Email: ['', Validators.email],
      LoginID: [''],
      Password: [''],
      DateofBirth: [''],
      STARTDATE: [''],
      NationalID: [''],
      ROLE: [''],
      Status: ['']
    });
  }

  public ClickOk(): void {
    this.bsModalRef.hide();
  }

  get f() { return this.UserEditForm.controls; }

  public GetModalData() {
    if (this.data['UID']) {
      this.UserEditForm.patchValue({
        UID: this.data['UID'],
        UserName: this.data['UserName'],
        Designation: this.data['Designation'],
        Degrees: this.data['Degrees'],
        Mobile: this.data['Mobile'],
        Email: this.data['Email'],
        LoginID: this.data['LoginID'],
        Password: this.data['Password'],
        DateofBirth: this.datePipe.transform(this.data['DateofBirth'], 'dd-MMM-yyyy'),
        STARTDATE: this.datePipe.transform(this.data['STARTDATE'], 'dd-MMM-yyyy'),
        NationalID: this.data['NationalID'],
        ROLE: this.data['ROLE'],
        Status: this.data['Status'],
      });
      this.Roles;
    }
  }

  public Save(): void {
    this.submitted = true;
    if (!this.UserEditForm.valid) {
      return;
    }
    this.spinner.show();
    this.userService.Save(this.UserEditForm.value).subscribe({
      next: (res: any) => {
        if (res === true) {
          this.submitted = false;
          this.bsModalRef.hide();
          this.toastr.success('Update User!', 'Update User Successfully.');
          this.action.emit(this.UserEditForm.value);
        } else if (res === false) {
          this.toastr.warning('New User!', 'Transaction Rollback.');
        }
      },
      error: (err: any) => {
        this.toastr.warning('Error!', err);
      },
      complete: () => {
        this.submitted = false;
        this.spinner.hide();
      }
    });
  }
  public NoDoubleSpaceAllowed(control: FormControl) {
    if (control.value !== null && control.value.indexOf('  ') != -1){
      return {NoDoubleSpaceAllowed: true}
    }
    return null;
  }
  @HostListener('window:keyup', ['$event']) keyevent(event: any) {
    event.preventDefault();
    // const inputs = Array.prototype.slice.call(document.querySelectorAll('input, button'));
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
