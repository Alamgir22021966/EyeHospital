import {AppState} from '@/store/state';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Store} from '@ngrx/store';
import {AppService} from '@services/app.service';
import { LoginService } from '@services/login.service';
import { LocalStorageService } from 'ngx-webstorage';
import {Observable} from 'rxjs';

const BASE_CLASSES = 'main-sidebar elevation-4';
@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public user;
    public JOBTITLE: string;
    public menu = MENU;
    public CurrentRole: string;

    constructor(
        public appService: AppService,
        private loginservice: LoginService,
        private jwtHelper: JwtHelperService,
        private localStorageService: LocalStorageService,
        private store: Store<AppState>
    ) {}

    public async ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
        });
        this.user = this.appService.user;
        this.JOBTITLE = localStorage.getItem('JOBTITLE')
        
        this.getManu();
    }

    public async getManu() {
        (await this.loginservice.GetUserInformation(this.jwtHelper.decodeToken(this.localStorageService.retrieve('token')).primarysid)).subscribe(
            (res: any) => {
                if (res.ROLE === 'Admin') {
                    this.menu = MENU
                } else if (res.ROLE === 'Consultant') {
                    this.menu = MENU_Consultant;
                }
                //  else if (res.ROLE === 'Territory Sales Manager') {
                //     this.menu = MENU_TSM;
                // } else if (res.ROLE === 'Warehouse Manager') {
                //     this.menu = MENU_WHM;
                // } else if (res.ROLE === 'Accounts Manager') {
                //     this.menu = MENU_ATM;
                // }
            }
        );
    }
}

export const MENU = [
    {
        name: 'Dashboard',
        // iconClasses: 'fas fa-tachometer-alt',
        path: ['/home/dashboard/Dashboard']
    },
    {
        name: 'General Information',
        // iconClasses: 'fas fa-folder',        
        children: [
            {
                name: 'User Information',
                path: ['/home/adminpanel/Userlist']
            },
            // {
            //     name: 'Available',
            //     iconClasses: 'fas fa-file',
            //     path: ['/home/available']
            // },
            {
                name: 'One Time Password',
                path: ['/home/adminpanel/OTP']
            },
        ]
    },
    {
        name: 'Patient Information',
        children: [
            {
                name: 'Patient List',
                path: ['/home/patient/PatientList']
            },

        ]
    },
    {
        name: 'Prescription',
        children: [
            {
                name: 'NewPatientList',
                path: ['/home/Prescription/NewPatientList']
            },
           
        ]
    },
];

export const MENU_Consultant = [
    {
        name: 'Dashboard',
        path: ['/home/dashboard/Dashboard']
    },
    // {
    //     name: 'General Information',
    //     // iconClasses: 'fas fa-folder',        
    //     children: [
    //         {
    //             name: 'User Information',
    //             path: ['/home/adminpanel/Userlist']
    //         },
    //     ]
    // },
    // {
    //     name: 'Patient Information',
    //     children: [
    //         {
    //             name: 'Patient List',
    //             path: ['/home/patient/PatientList']
    //         },
           
    //     ]
    // },
    {
        name: 'Prescription',
        children: [
            {
                name: 'NewPatientList',
                path: ['/home/Prescription/NewPatientList']
            },
           
        ]
    },
];
