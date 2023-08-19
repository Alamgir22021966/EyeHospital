import { NgModule } from '@angular/core';
import { PatientRoutingModule, routingComponents } from './patient-routing.module';
import { ShareModule } from '@/Shared/share.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    routingComponents,
  ],
  imports: [
    ShareModule,
    PatientRoutingModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class PatientModule { }
