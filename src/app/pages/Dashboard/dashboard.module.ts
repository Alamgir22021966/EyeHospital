import { NgModule } from '@angular/core';
import { DashboardRoutingModule, routingComponents } from './dashboard-routing.module';
import { ShareModule } from '@/Shared/share.module';
import { NgOptimizedImage } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    routingComponents,
  ],
  imports: [
    DashboardRoutingModule,
    ShareModule,
    NgOptimizedImage,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class DashboardModule { }
