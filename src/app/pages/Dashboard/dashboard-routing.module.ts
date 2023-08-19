import { inject, NgModule } from '@angular/core';
import { Route, RouterModule, Routes, UrlSegment } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DonutChartComponent } from './graph/donut-chart/donut-chart.component';
import { BarChartComponent } from './graph/bar-chart/bar-chart.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { CanMatchGuard } from '@guards/can-match.guard';
import { LoginService } from '@services/login.service';

const routes: Routes = [
  {
    path: '', data: { title: 'Dashboard' },
    children: [
      {
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
      },
      {
        path: 'Dashboard', component: DashboardComponent,
        canMatch: [CanMatchGuard],
        data: { title: 'Dashboard', Roles: ['Admin', 'Consultant'] }
      },
      // {
      //   path: 'Dashboard', component: DashboardComponent,
      //   canMatch: [(route: Route, segments: UrlSegment[]) => {
      //     const roles = [localStorage.getItem('CurrentRole')];
      //     const roleMatches = roles.indexOf('Admin') !== -1;
      //     return roleMatches < 0 ? false : true;
      //   }],
      //   data: { title: 'Dashboard' }
      // },
      {
        path: 'Dashboard', component: UserDashboardComponent,
        data: { title: 'User Dashboard' }
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

export const routingComponents = [
  DashboardComponent,
  UserDashboardComponent,
  BarChartComponent,
  DonutChartComponent
];
