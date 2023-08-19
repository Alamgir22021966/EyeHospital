import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from '@modules/main/main.component';
// import { RegisterComponent } from '@modules/register/register.component';
import { AuthGuard } from '@guards/auth.guard';
import { NonAuthGuard } from '@guards/non-auth.guard';
// import { ForgotPasswordComponent } from '@modules/forgot-password/forgot-password.component';
// import { RecoverPasswordComponent } from '@modules/recover-password/recover-password.component';
import { MainMenuComponent } from '@pages/main-menu/main-menu.component';
// import { SubMenuComponent } from '@pages/main-menu/sub-menu/sub-menu.component';
import { RoleGuard } from '@guards/role.guard';
import { ProfileComponent } from '@pages/profile/profile.component';


// const route = {
//     path: 'dashboard',
//     canActivate: [() => inject(AuthService).isAuthenticated()]
//   };
const routes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: async () => (await import('./modules/login/login.component')).LoginComponent, canActivate: [NonAuthGuard]
    },
    {
        path: 'home',
        component: MainComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: async () => (await import('./pages/Dashboard/dashboard.module')).DashboardModule, pathMatch: 'prefix',
            },
            {
                path: 'adminpanel',
                loadChildren: async () => (await import('./Views/AdminPanel/adminpanel.module')).AdminpanelModule, pathMatch: 'prefix',
            },
            {
                path: 'patient',
                loadChildren: async () => (await import('./Views/Patient/patient.module')).PatientModule, pathMatch: 'prefix',
            },
            {
                path: 'Prescription',
                loadChildren: async () => (await import('./Views/Prescription/prescription.module')).PrescriptionModule, pathMatch: 'prefix',
            },
            {
                path: 'available',
                loadComponent: async () => (await import('./pages/available/available.component')).AvailableComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },

        ]
    },

    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
    MainComponent,
    MainMenuComponent,
    // RegisterComponent,
    // ForgotPasswordComponent,
    // RecoverPasswordComponent,
    // DashboardComponent,
    // SubMenuComponent,
];
