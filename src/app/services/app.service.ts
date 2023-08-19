import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Gatekeeper } from 'gatekeeper-client-sdk';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    // public user: any = null;
    public user = {
        firstName: 'Alexander',
        lastName: 'Pierce',
        // image: 'assets/img/user2-160x160.jpg',
        image: 'assets/user.png',
        image1: 'assets/img/clarins_old.png',
    };

    constructor(private router: Router, private toastr: ToastrService) { }

    public async loginByAuth() {
        try {
            // this.router.navigate(['/']);
            this.router.navigate(['/home/dashboard'], { state: this.user });
            // this.router.navigateByUrl('/home/dashboard', { state: this.user });

        } catch (error) {
            this.toastr.error(error.response.data.message);
        }
    }

    async loginByAuth1({ email, password }) {
        try {
            // const token = await Gatekeeper.loginByAuth(email, password);
            // localStorage.setItem('token', token);
            // await this.getProfile();
            // this.router.navigate(['/']);
            this.router.navigate(['/home/dashboard']);
        } catch (error) {
            this.toastr.error(error.response.data.message);
        }
    }

    async registerByAuth({ email, password }) {
        try {
            const token = await Gatekeeper.registerByAuth(email, password);
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Register success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async loginByGoogle() {
        try {
            const token = await Gatekeeper.loginByGoogle();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Login success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async registerByGoogle() {
        try {
            const token = await Gatekeeper.registerByGoogle();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Register success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async loginByFacebook() {
        try {
            const token = await Gatekeeper.loginByFacebook();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Login success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async registerByFacebook() {
        try {
            const token = await Gatekeeper.registerByFacebook();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Register success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async getProfile() {
        try {
            this.user = await Gatekeeper.getProfile();
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        // localStorage.removeItem('gatekeeper_token');
        // this.user = null;
        this.router.navigate(['/login']);
    }

}
