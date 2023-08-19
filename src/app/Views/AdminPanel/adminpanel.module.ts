import { NgModule } from '@angular/core';
import { AdminpanelRoutingModule, routingComponents } from './adminpanel-routing.module';
import { ShareModule } from '@/Shared/share.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    routingComponents,
    
  ],
  imports: [
    ShareModule,
    BsDatepickerModule.forRoot(),
    AdminpanelRoutingModule,
  ]
})
export class AdminpanelModule { }
