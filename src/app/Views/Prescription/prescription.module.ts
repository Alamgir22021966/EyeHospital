import { NgModule } from '@angular/core';
import { PrescriptionRoutingModule, routingComponents } from './prescription-routing.module';
import { ShareModule } from '@/Shared/share.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    routingComponents,
    
  ],
  imports: [
    ShareModule,
    PrescriptionRoutingModule,
    NgSelectModule,
  ]
})
export class PrescriptionModule { }
