import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppService } from '@services/app.service';
import { LoginService } from '@services/login.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    public user;
    public FullName: string;
    public STARTDATE: any;

    constructor(
        private appService: AppService,
        private loginservice: LoginService,
        private jwtHelper: JwtHelperService,
        private datePipe: DatePipe,
        private localStorageService: LocalStorageService
    ) { }

    ngOnInit(): void {
        this.user = this.appService.user;
        this.getFullName();
    }

    logout() {
        this.loginservice.logout();
    }

    public async getFullName() {
        (await this.loginservice.GetUserInformation(this.jwtHelper.decodeToken(this.localStorageService.retrieve('token')).primarysid)).subscribe(
            (res: any) => {
                if (res.UID) {
                    this.FullName = res.UserName;
                    this.STARTDATE = this.datePipe.transform(res.STARTDATE, 'dd-MMM-yyyy');
                    localStorage.setItem('InputBY', res.UserName);
                }
            }
        );
    }

}
