import { InteractivityChecker } from '@angular/cdk/a11y';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfmakeService } from '@services/PDFMake/pdfmake.service';
import { CustomImage } from '@services/PDFMake/pdfmakeimage';
import { PatientService } from '@services/patient.service';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {
  @ViewChild('Autofocus') myfield: ElementRef<HTMLInputElement>;

  @Input() public title: string;
  @Input() data: any[] = [];
  @Output() action = new EventEmitter();
  form: FormGroup;
  submitted = false;
  isDisable = true;
  public caption: string = 'Save';

  public AllConsultants: Observable<Array<any>>;
  public sex: Observable<Array<any>>;

  datePickerConfig: Partial<BsDatepickerConfig>;
  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private interactivityChecker: InteractivityChecker,
    private toastr: ToastrService,
    private patientservice: PatientService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private pdfService: PdfmakeService,
    private el: ElementRef
  ) {
    this.Createform();

  }

  Createform() {
    this.form = this.fb.group({
      ApptNo: [''],
      ApptDate: [''],
      ApptTime: [''],
      Contact: [''],
      PID: [''],
      Name: [''],
      Sex: [''],
      Age: [''],
      Type: [''],
      Consultant: [''],
      fees: ['', Validators.required],
    });
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.GetModalData();
    setTimeout(() => {
      this.myfield.nativeElement.focus();
    }, 100);
  }

  public GetModalData() {
    if (this.data['PID']) {
      this.form.patchValue({
        ApptNo: this.data['ApptNo'],
        ApptDate: this.datePipe.transform(this.data['ApptDate'], 'dd-MMM-yyyy'),
        ApptTime: this.data['ApptTime'],
        PID: this.data['PID'],
        Name: this.data['Name'],
        Sex: this.data['Sex'],
        Age: this.data['Age'],
        Contact: this.data['Contact'],
        Type: this.data['Type'],
        Consultant: this.data['Consultant'],
        fees: this.data['fees'],
      });
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
        this.patientservice.Update(this.form.value).subscribe({
          next: (res: any) => {
            if (res === true) {
              this.toastr.success('Update Patient!', 'Update Successfully.');
            } else if (res === false) {
              this.toastr.warning('Update Patient!', 'Transaction Rollback.');
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

  

  public async GeneratePDF() {
    await this.pdfService.loadPdfMaker();

    this.pdfService.pdfMake.createPdf(this.DocumentDefinition()).open();
  }
  public DocumentDefinition() {

    var REPORTTYPE = "Invoice";
    var Currentdate = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    return {
      pageMargins: [40, 100, 40, 50],
      // pageOrientation: 'landscape',
      // watermark: { text: 'Planten Sales Information ', color: 'blue', opacity: 0.02, bold: false, italics: true },

      header: function () {
        return [
          {
            fontSize: 8,
            columns: [
              {
                // image: CustomImage.PlantenNew, height: 30, width: 180, alignment: 'left', margin: [40, 20, 0, 5]
              },
              {
                image: CustomImage.PlantenNew, height: 30, width: 180, alignment: 'right', margin: [0, 20, 20, 5]
              },
            ]
          },
          {
            fontSize: 8,
            columns: [
              {
                text: `Patient ${REPORTTYPE}`, bold: true, alignment: 'left', fontSize: 14, margin: [40, 0, 0, 5]
              },
              {
                text: `Generated on: ${Currentdate}`, bold: true, alignment: 'right', fontSize: 10, margin: [0, 0, 40, 5]
              }
            ]
          },
          {
            canvas: [
              { type: 'line', x1: 40, y1: 10, x2: 595 - 40, y2: 10, lineWidth: 0.01, color: '#cc2222' }
            ]
          },
          {
            canvas: [
              { type: 'line', x1: 40, y1: 0, x2: 595 - 40, y2: 0, lineWidth: 0.01, color: '#cc2222' }
            ]
          },
        ];
      },

      footer: function (currentPage, pageCount) {
        return { text: currentPage.toString() + ' / ' + pageCount, alignment: 'right', margin: [0, 10, 40, 0] };
      },
      background: function (currentPage: number, pageSize: any) {
        if (currentPage === 1) {
          return [
            {
              image: CustomImage.PlantenNew,
              // fit: [pageSize.width, pageSize.height],
              width: 300,
              height: 80,
              absolutePosition: { x: pageSize.width / 4 + 20, y: pageSize.height / 2 },
              opacity: 0.02
            },
          ]
        }
      },

      content: [
        {
          fontSize: 12, lineHeight: 1.2,
          columns: [
            [
              {
                text: 'Appointment No: ' + this.f.ApptNo.value,
              },
            ],
            [
              {
                text: 'Appointment Date : ' + this.datePipe.transform(this.f.ApptDate.value, 'dd-MMM-yyyy') + ' ' + this.f.ApptTime.value, alignment: 'right'
              },
            ],
          ]
        },
        
        {
          lineHeight: 1.1,
          columns: [
            [
              {
                text: 'Patient ID : ' + this.f.PID.value,
              },
            ],
            [
              {
                text: 'Patient Name : ' + this.f.Name.value, alignment: 'right'
              },
            ],
          ]
        },
        {
          fontSize: 12, lineHeight: 1.2,
          columns: [
            [
              {
                text: 'Sex : ' + this.f.Sex.value,
              },
            ],
            [
              {
                text: 'Age : ' + this.f.Age.value, alignment: 'right'
              },
            ],
          ]
        },
        {
          lineHeight: 1.1,
          columns: [
            [
              {
                text: 'Patient Type: ' + this.f.Type.value
              },
            ],
            [
              {
                text: 'Contact No.: ' + this.f.Contact.value, alignment: 'right'

              },
            ],
          ]
        },
        {
          lineHeight: 1.1,
          columns: [
            [
              {
                text: 'Consultant : ' + this.f.Consultant.value, fontSize: 10
              },
            ],
            [
              {
                text: 'Fees : ' + this.decimalPipe.transform(parseInt(this.f.fees.value || 0), '1.1-1'), alignment: 'right'
              },
            ],
          ]
        },

      ],

      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        },
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline'
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          fillColor: '#fffeee',
        }
      }
    }
  }



}
