import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { RoleGuard } from '@guards/role.guard';
import { NewUserComponent } from './UserInformation/new-user/new-user.component';
import { EditUserComponent } from './UserInformation/edit-user/edit-user.component';
import { UserListComponent } from './UserInformation/user-list/user-list.component';
import { OTPComponent } from './OTP/otp.component';
// import { EditUserComponent } from './UserInformation/edit-user/edit-user.component';
// import { NewUserComponent } from './UserInformation/new-user/new-user.component';
// import { UserListComponent } from './UserInformation/user-list/user-list.component';

const routes: Routes = [
  {
    path: '', data: { title: 'New User Component' },
    children: [
      {
        path: '', redirectTo: 'adminpanel', pathMatch: 'full'
      },
      {
        path: 'Userlist', component: UserListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'User List  Component',
          Roles: ['Admin', 'Manager']
        }

      },
      {
        path: 'OTP', component: OTPComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'One Time Password',
          Roles: ['Admin', 'Manager']
        }

      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminpanelRoutingModule { }

export const routingComponents = [
  NewUserComponent,
  EditUserComponent,
  UserListComponent,
  OTPComponent

];
