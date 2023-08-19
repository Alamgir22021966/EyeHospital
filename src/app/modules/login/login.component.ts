import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, Renderer2, HostBinding, ElementRef, HostListener } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoginService } from '@services/login.service';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { HttpStatusCode } from '@angular/common/http';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ShareModule } from '@/Shared/share.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-loginn',
    standalone: true,
    imports: [CommonModule, NgxSpinnerModule, ShareModule, NgOptimizedImage],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    @HostBinding('class') class = 'login-box';
    public loginForm: FormGroup;
    submitted = false;

    constructor(
        private fb: FormBuilder,
        private renderer: Renderer2,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        private loginservice: LoginService,
        private elementRef: ElementRef,
        private interactivityChecker: InteractivityChecker,
        private router: Router,

        private jwtHelper: JwtHelperService,
        private localStorageService: LocalStorageService,
    ) {
        this.createloginForm();
    }

    createloginForm(): void {
        this.loginForm = this.fb.group({
            LoginID: ['', Validators.required],
            Password: ['', Validators.required],
        });
    }

    get f() { return this.loginForm.controls; }

    ngOnInit() {
        this.renderer.addClass(
            document.querySelector('app-root'),
            'login-page'
        );

    }

    public onfocus(form: FormGroup) {
        for (const key of Object.keys(form.controls)) {
            if (form.controls[key].invalid) {
                const invalidControl = this.elementRef.nativeElement.querySelector('[formcontrolname="' + key + '"]');
                invalidControl.focus();
                break;
            }
        }
    }

    public async onSubmit() {
        this.onfocus(this.loginForm);
        this.submitted = true;
        if (!this.loginForm.valid) {
            return;
        }
        (await this.loginservice.GetLogin(this.loginForm.value)).subscribe({
            next: () => {
                this.submitted = false;

            },
            error: (err: any) => {
                if (err.status === HttpStatusCode.Unauthorized || err.statusTest === HttpStatusCode.Ok) {
                    this.toastr.error('Incorrect user name or password.', 'Authentication failed.', {
                        timeOut: 2000
                    });
                }
            },
            complete: () => {
                this.spinner.show();
                this.GetUserRole();

                setTimeout(() => {
                    this.router.navigate(['/home/dashboard/Dashboard']);
                    this.spinner.hide();
                }, 1000);
            }
        });
    }
    public async GetUserRole() {
        (await this.loginservice.GetUserInformation(this.jwtHelper.decodeToken(this.localStorageService.retrieve('token')).primarysid)).subscribe(
            (res: any) => {
                if (res.UID) {
                    localStorage.setItem('CurrentRole', res.ROLE);
                    localStorage.setItem('JOBTITLE', res.Designation)
                    localStorage.setItem('Consultant', res.UserName)
                }
            }
        );
    }

    @HostListener('window:keyup', ['$event']) keyevent(event: any) {
        event.preventDefault();
        const inputs = Array.prototype.slice.call(document.querySelectorAll('input, button'));
        const controls = [];
        if (Array.isArray(controls) && !controls.length) {
            for (let i = 0; i < inputs.length; i++) {
                if (this.interactivityChecker.isFocusable(inputs[i])) {
                    controls.push(inputs[i]);
                }
            }
        }

        if (event.keyCode === 13 || event.keyCode === 40) {
            const control = controls[controls.indexOf(document.activeElement) + 1];
            if (control) {
                control.focus();
                // control.select();
            }
        } else if (event.keyCode === 38) {
            const control = controls[controls.indexOf(document.activeElement) - 1];
            if (control) {
                control.focus();
                // control.select();
            }
        }
    }
}

