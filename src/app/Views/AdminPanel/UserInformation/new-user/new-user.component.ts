import { InteractivityChecker } from '@angular/cdk/a11y';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, isFormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupService } from '@services/lookup.service';
import { UserService } from '@services/user.service';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  @ViewChild('Autofocus') myfield: ElementRef<HTMLInputElement>;

  @ViewChild(BsDatepickerDirective) datepicker: BsDatepickerDirective;

  datePickerConfig: Partial<BsDatepickerConfig>;
  @Input() public title: string;
  @Output() action = new EventEmitter();
  NewUserForm: FormGroup;
  submitted = false;
  public caption: string = 'Save';
  public Regions = [];
  public Territories = [];
  public Roles: Observable<Array<any>>;
  public Designations: Observable<Array<any>>;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private userService: UserService,
    private lookupService: LookupService,
    private interactivityChecker: InteractivityChecker,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private el: ElementRef
  ) {
    this.CreateRegistrationForm();
    
    this.datePickerConfig = Object.assign({}, {
      showWeekNumbers: false,
      isAnimated: true,
      dateInputFormat: 'DD-MMM-YYYY',
      todayHighlight: true
    });
  }
  
  CreateRegistrationForm() {
    this.NewUserForm = this.fb.group({
      UID: ['', Validators.required],
      UserName: ['', [Validators.required, this.NoDoubleSpaceAllowed]],
      Designation: ['', Validators.required],
      Degrees: ['', this.NoDoubleSpaceAllowed],
      Mobile: ['', Validators.required],
      Email: ['', Validators.email],
      LoginID: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      DateofBirth: [''],
      STARTDATE: [''],
      NationalID: [''],
      ROLE: ['', Validators.required],
      Status: ['']
    });
  }

  get f() { return this.NewUserForm.controls; }

  ngOnInit() {
    setTimeout(()=>{
      this.myfield.nativeElement.focus();
      },100);

    this.Roles = this.lookupService.GetRoles();
    this.Designations = this.lookupService.GetDesignation();
  }

  @HostListener('window:scroll')
  onScrollEvent() {
      this.datepicker.hide();
  }

  public ChangeData(): void {
    if (this.caption === 'New') {
      this.f.UID.enable();
      this.NewUserID();
    }
    else if (this.caption === 'Save') {
      this.Save();
    }
  }

  public NewUserID(): void {
    this.submitted = false;
    this.NewUserForm.reset();
    this.myfield.nativeElement.focus();
    this.caption = 'Save';
  }

  public Cancel() {
    this.NewUserForm.reset();
    this.submitted = false;
    if (this.caption === 'Save') {
      this.caption = 'New';
    }
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
    this.onfocus(this.NewUserForm);
    this.submitted = true;
    if (!this.NewUserForm.valid) {
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
        this.userService.Save(this.NewUserForm.value).subscribe({
          next: (res: any) => {
            if (res === true) {
              this.toastr.success('New User Created!', 'Saved Successfully.');
            } else if(res === false){
              this.toastr.warning('New User!', 'Transaction Rollback.');
            }
          },
          error: err => {
            this.toastr.info(err, 'info');
          },
          complete: () => {
            this.submitted = false;
            this.action.emit(this.NewUserForm.value);
            this.bsModalRef.hide();
          }
        });
      } else if (result.isDenied) {
        this.toastr.info('Changes are not saved!', 'info');
      }
    })
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

  public getClass() {
    var classList = '';
    if (this.caption === 'New') {
      classList = 'fa fa-plus';
    } else if (this.caption === 'Save') {
      classList = 'fa fa-save';
    }
    return classList;
  }

}
