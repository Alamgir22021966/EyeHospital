import { Component, HostListener, ViewChild } from '@angular/core';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;
    @HostListener('window:scroll')
    onScrollEvent() {
        this.datepicker.hide();
    }
}
