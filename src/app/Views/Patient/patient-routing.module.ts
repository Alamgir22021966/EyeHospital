import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { RoleGuard } from '@guards/role.guard';
import { AppointmentComponent } from './appointment/appointment.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { InvoiceComponent } from './invoice/invoice.component';

const routes: Routes = [
  {
    path: '', data: { title: 'Patient' },
    children: [
      {
        path: '', redirectTo: 'patient', pathMatch: 'full'
      },
      {
        path: 'PatientList', component: PatientListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Patient List',
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
export class PatientRoutingModule { }

export const routingComponents = [
  AppointmentComponent,
  InvoiceComponent,
  PatientListComponent,

];
