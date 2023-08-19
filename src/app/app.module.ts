import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule, routingComponents} from '@/app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from '@modules/main/header/header.component';
import {FooterComponent} from '@modules/main/footer/footer.component';
import {MenuSidebarComponent} from '@modules/main/menu-sidebar/menu-sidebar.component';
import {BlankComponent} from '@pages/blank/blank.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ProfileComponent} from '@pages/profile/profile.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {MessagesComponent} from '@modules/main/header/messages/messages.component';
import {NotificationsComponent} from '@modules/main/header/notifications/notifications.component';

import {DatePipe, DecimalPipe, NgOptimizedImage, registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import {UserComponent} from '@modules/main/header/user/user.component';
import {LanguageComponent} from '@modules/main/header/language/language.component';
import {MenuItemComponent} from './components/menu-item/menu-item.component';
import {ControlSidebarComponent} from './modules/main/control-sidebar/control-sidebar.component';
import {StoreModule} from '@ngrx/store';
import {authReducer} from './store/auth/reducer';
import {uiReducer} from './store/ui/reducer';
import {ProfabricComponentsModule} from '@profabric/angular-components';
import {defineCustomElements} from '@profabric/web-components/loader';
import {SidebarSearchComponent} from './components/sidebar-search/sidebar-search.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { getBaseUrl } from 'main';
import { JwtModule } from '@auth0/angular-jwt';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RemoveCommaPipe } from './pipes/remove-comma.pipe';
import { NgSelectModule } from '@ng-select/ng-select';

defineCustomElements();
registerLocaleData(localeEn, 'en-EN');

export function tokenGetter() {
    return localStorage.getItem("access_token");
  }

@NgModule({
    declarations: [
        AppComponent,
        routingComponents,
        HeaderComponent,
        FooterComponent,
        MenuSidebarComponent,
        BlankComponent,
        ProfileComponent,
        MessagesComponent,
        NotificationsComponent,
        UserComponent,
        LanguageComponent,
        MenuItemComponent,
        ControlSidebarComponent,
        SidebarSearchComponent,
        RemoveCommaPipe,
    ],
    imports: [
        BrowserModule,
        StoreModule.forRoot({auth: authReducer, ui: uiReducer}),
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true
        }),
        ProfabricComponentsModule,
        FontAwesomeModule,
        NgxSpinnerModule,
        NgOptimizedImage,
        NgxWebstorageModule.forRoot(),
        BsDatepickerModule.forRoot(),
        MDBBootstrapModule.forRoot(),
        ModalModule.forRoot(),
        NgSelectModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: ["example.com"],
                disallowedRoutes: ["http://example.com/examplebadroute/"],
            },
        }),
    ],
    providers: [
        { provide: 'BASE_URL', useFactory: getBaseUrl },
        DatePipe,
        DecimalPipe,
        BsModalService,
        BsModalRef,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
