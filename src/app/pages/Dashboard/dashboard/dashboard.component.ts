import { ShareService } from '@/Shared/share.service';
import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DashboardService } from '@services/dashboard.service';
import { GraphService } from '@services/Graph/graph.service';
import { LookupService } from '@services/lookup.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    form: FormGroup;
    isConsultant = false;
    public TotalAppointment;
    public TotalPresent;
    public NewPatient;
    datePickerConfig: Partial<BsDatepickerConfig>;
    public AllConsultants = this.shareService.AllConsultants.asObservable();

    constructor(
        private fb: FormBuilder,
        private shareService: ShareService,
        private dashboardService: DashboardService,
        private graphService: GraphService,
        private datePipe: DatePipe,
        private toastr: ToastrService,
        private lookupService: LookupService
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
        this.form = this.fb.group({
            ApptDate: [''],
            Consultant: [''],
        });
    }

    ngOnInit(): void {
        this.GetAllConsultant()
        // this.GetBARDATA();
        this.f.get('ApptDate').patchValue(new Date());
        this.f.get('Consultant').patchValue('All');
        this.GetTotalAppointment();
        this.GetTotalPresent();
        this.GetNewPatient();

        if (localStorage.getItem('CurrentRole') === 'Consultant') {
            this.isConsultant = true;
        }

        this.form.get('Consultant').valueChanges.subscribe(() => {
            this.GetTotalAppointment();
            this.GetTotalPresent();
            this.GetNewPatient();
        })
    }

    get f() { return this.form; }

    public GetBARDATA() {
        this.form.get('YEAR').valueChanges.subscribe((val) => {
            this.GetGRAPHDATA(val);
        });
    }

    public GetGRAPHDATA(YEAR: any): void {
        this.dashboardService.GetBarChart(YEAR).subscribe((data) => {
            this.graphService.emitBarDataEvent(data);
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

    public GetTotalAppointment(): any {
        let params;
        if (localStorage.getItem('CurrentRole') === 'Consultant') {
            params = new HttpParams().appendAll({
                'ApptDate': this.form.get('ApptDate').value !== '' ? this.datePipe.transform(this.form.get('ApptDate').value, 'dd/MM/yyyy') : this.datePipe.transform(new Date(), 'DD/MM/YYYY'),
                'Consultant': localStorage.getItem('Consultant'),
            });
        } else if (localStorage.getItem('CurrentRole') === 'Admin') {
            params = new HttpParams().appendAll({
                'ApptDate': this.form.get('ApptDate').value !== '' ? this.datePipe.transform(this.form.get('ApptDate').value, 'dd/MM/yyyy') : this.datePipe.transform(new Date(), 'DD/MM/YYYY'),
                'Consultant': this.form.get('Consultant').value !== 'All' ? this.form.get('Consultant').value : 'All',
            });
        } else {
            params = new HttpParams().appendAll({
                'ApptDate': this.form.get('ApptDate').value !== '' ? this.datePipe.transform(this.form.get('ApptDate').value, 'dd/MM/YYYY') : this.datePipe.transform(new Date(), 'DD/MM/YYYY'),
                'Consultant': this.form.get('Consultant').value !== 'All' ? this.form.get('Consultant').value : 'All',
            });
        }

        this.dashboardService.GetTotalAppointment(params).subscribe(
            res => {
                this.TotalAppointment = res !== null ? res : 0;
            });
    }
    public GetTotalPresent(): any {
        let params;
        if (localStorage.getItem('CurrentRole') === 'Consultant') {
            params = new HttpParams().appendAll({
                'ApptDate': this.form.get('ApptDate').value !== '' ? this.datePipe.transform(this.form.get('ApptDate').value, 'dd/MM/yyyy') : this.datePipe.transform(new Date(), 'DD/MM/YYYY'),
                'Consultant': localStorage.getItem('Consultant'),
            });
        } else if (localStorage.getItem('CurrentRole') === 'Admin') {
            params = new HttpParams().appendAll({
                'ApptDate': this.form.get('ApptDate').value !== '' ? this.datePipe.transform(this.form.get('ApptDate').value, 'dd/MM/yyyy') : this.datePipe.transform(new Date(), 'DD/MM/YYYY'),
                'Consultant': this.form.get('Consultant').value !== 'All' ? this.form.get('Consultant').value : 'All',
            });
        } else {
            params = new HttpParams().appendAll({
                'ApptDate': this.form.get('ApptDate').value !== '' ? this.datePipe.transform(this.form.get('ApptDate').value, 'dd/MM/YYYY') : this.datePipe.transform(new Date(), 'DD/MM/YYYY'),
                'Consultant': this.form.get('Consultant').value !== 'All' ? this.form.get('Consultant').value : 'All',
            });
        }

        this.dashboardService.GetTotalPresent(params).subscribe(
            res => {
                this.TotalPresent = res !== null ? res : 0;
            });
    }

    public GetNewPatient(): any {
        let params;
        if (localStorage.getItem('CurrentRole') === 'Consultant') {
            params = new HttpParams().appendAll({
                'ApptDate': this.form.get('ApptDate').value !== '' ? this.datePipe.transform(this.form.get('ApptDate').value, 'dd/MM/yyyy') : this.datePipe.transform(new Date(), 'DD/MM/YYYY'),
                'Consultant': localStorage.getItem('Consultant'),
            });
        } else if (localStorage.getItem('CurrentRole') === 'Admin') {
            params = new HttpParams().appendAll({
                'ApptDate': this.form.get('ApptDate').value !== '' ? this.datePipe.transform(this.form.get('ApptDate').value, 'dd/MM/yyyy') : this.datePipe.transform(new Date(), 'DD/MM/YYYY'),
                'Consultant': this.form.get('Consultant').value !== 'All' ? this.form.get('Consultant').value : 'All',
            });
        } else {
            params = new HttpParams().appendAll({
                'ApptDate': this.form.get('ApptDate').value !== '' ? this.datePipe.transform(this.form.get('ApptDate').value, 'dd/MM/YYYY') : this.datePipe.transform(new Date(), 'DD/MM/YYYY'),
                'Consultant': this.form.get('Consultant').value !== 'All' ? this.form.get('Consultant').value : 'All',
            });
        }

        this.dashboardService.GetNewPatient(params).subscribe(
            res => {
                this.NewPatient = res !== null ? res : 0;
            });
    }

}
