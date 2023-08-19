import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [],
  imports: [
    // CommonModule
    MDBBootstrapModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule,
    // PerfectScrollbarModule,
    AutocompleteLibModule,
    NgbModule,
    NgSelectModule,

  ]
})
export class ShareModule { }
