import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { InvoiceComponent } from '../Patient/invoice/invoice.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { AuthGuard } from '@guards/auth.guard';
import { RoleGuard } from '@guards/role.guard';
import { NewPatientListComponent } from './new-patient-list/new-patient-list.component';

const routes: Routes = [
  {
    path: '', data: { title: 'Prescription' },
    children: [
      {
        path: '', redirectTo: 'patient', pathMatch: 'full'
      },
      {
        path: 'NewPatientList', component: NewPatientListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'New Patient',
          Roles: ['Admin', 'Consultant']
        }
      },
      {
        path: 'Prescription', component: PrescriptionComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Prescription',
          Roles: ['Admin', 'Consultant']
        }
      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrescriptionRoutingModule { }

export const routingComponents = [
  NewPatientListComponent,
  PrescriptionComponent,

];