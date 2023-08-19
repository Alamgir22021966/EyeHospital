import { ShareService } from '@/Shared/share.service';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfmakeService } from '@services/PDFMake/pdfmake.service';
import { LookupService } from '@services/lookup.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CustomImage } from '@services/PDFMake/pdfmakeimage';
import Swal from 'sweetalert2';
import { PrescriptionService } from '@services/prescriptionservice';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent {
  @ViewChild('Autofocus') myfield: ElementRef<HTMLInputElement>;

  @Input() public queryParams: string;
  @Output() action = new EventEmitter();
  form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private interactivityChecker: InteractivityChecker,
    private toastr: ToastrService,
    private shareService: ShareService,
    private patientservice: PrescriptionService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private service: LookupService,
    private pdfService: PdfmakeService,
    private el: ElementRef
  ) {
    this.Createform();
  }


  Createform() {
    this.form = this.fb.group({
      Prescription: this.fb.group({
        ApptNo: [''],
        PID: [''],
        Name: [''],
        Sex: [''],
        Age: [''],
      }),
      GlassRight: this.fb.group({
        SPH: [''],
        CYL: [''],
        AXIS: [''],
        VA: [''],
      }),
      GlassLeft: this.fb.group({
        SPH: [''],
        CYL: [''],
        AXIS: [''],
        VA: [''],
        NearAdd: [''],
        IPD: ['']
      }),
      Remarks: this.fb.group({
        Unifocal: [''],
        Bifocal: [''],
        Varilux: [''],
        Photosun: [''],
        Glass: [''],
        Plastic: [''],
        Antireflection: [''],
      }),
      Use: this.fb.group({
        Constant: [''],
        Distant: [''],
        Near: [''],
      }),
      ExaminationRight: this.fb.group({
        Vision: [''],
        PH: [''],
        AutoRefraction: [''],
        Glasses: [''],
        OrbitAdnexa: [''],
        AntSegment: [''],
        Fundus: [''],
        IOP: [''],
        SacTest: [''],
        Comments: ['']
      }),
      ExaminationLeft: this.fb.group({
        Vision: [''],
        PH: [''],
        AutoRefraction: [''],
        Glasses: [''],
        OrbitAdnexa: [''],
        AntSegment: [''],
        Fundus: [''],
        IOP: [''],
        SacTest: [''],
        Comments: ['']
      }),

    });
  }


  // Createform(): void {
  //   const arr = [];
  //   for (let i = 0; i < 20; i++) {
  //     arr.push(this.ListForm());
  //   }
  //   this.PatientListForm = this.fb.group({
  //     Patient: this.fb.group({
  //       PID: [''],
  //       Consultant: ['']
  //     }),
  //     PatientList: this.fb.array(arr) as FormArray,
  //   });
  // }

  get f() { return this.form.controls; }
  get Prescription() { return this.form.get('Prescription'); }

  ngOnInit(): void {

    this.GetModalData();
  }

  public GetModalData() {
  this.shareService.PatientData.subscribe(val=>{
    if (val['ApptNo']) {
      this.form.controls['Prescription'].patchValue({
        ApptNo: val['ApptNo'],
        PID: val['PID'],
        Name: val['Name'],
        Sex: val['Sex'],
        Age: val['Age'],
      });
    }
  })
   
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
              this.toastr.success('New Prescription!', 'Save Successfully.');
            } else if (res === false) {
              this.toastr.warning('New Prescription!', 'Transaction Rollback.');
            }
          },
          error: err => {
            this.toastr.info(err, 'info');
          },
          complete: () => {
            this.submitted = false;
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

    var REPORTTYPE = "Prescription";
    var Currentdate = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    return {
      pageMargins: [40, 100, 40, 50],

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
              // {
              //   text: `${REPORTTYPE}`, bold: true, alignment: 'left', fontSize: 14, margin: [40, 0, 0, 5]
              // },
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
          lineHeight: 1.1,
          columns: [
            [
              {
                text: 'Patient ID : ' + this.Prescription.get('PID').value,
              },
            ],
            [
              {
                text: 'Patient Name : ' + this.Prescription.get('Name').value, alignment: 'right'
              },
            ],
          ]
        },
        {
          fontSize: 12, lineHeight: 1.2,
          columns: [
            [
              {
                text: 'Sex : ' + this.Prescription.get('Sex').value,
              },
            ],
            [
              {
                text: 'Age : ' + this.Prescription.get('Age').value, alignment: 'right'
              },
            ],
          ]
        },
        // {
        //   lineHeight: 1.1,
        //   columns: [
        //     [
        //       {
        //         text: 'Patient Type: ' + this.f.Type.value
        //       },
        //     ],
        //     [
        //       {
        //         text: 'Contact No.: ' + this.f.Contact.value, alignment: 'right'

        //       },
        //     ],
        //   ]
        // },

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
