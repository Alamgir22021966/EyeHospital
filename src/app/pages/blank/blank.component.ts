import { Component } from '@angular/core';
@Component({
    selector: 'app-blank',
    templateUrl: './blank.component.html',
    styleUrls: ['./blank.component.scss']
})
export class BlankComponent {
    constructor() {

    }

    ngOnInit() {
        this.isAuthorized();
    }
    public expectedRoles = ['Admin', 'Manager'];

    private isAuthorized(): boolean {
        const roles = ['Admin', 'Manager'];
        const ExpectedRoles = this.expectedRoles;
        const roleMatches = roles.findIndex(role => ExpectedRoles.indexOf(role) !== -1);
        console.log('hgfhgfhgf',roleMatches);
        // return roleMatches < 0 ? false : true;
        return true
    }
}


// https://www.w3schools.com/howto/howto_css_sidenav_buttons.asp