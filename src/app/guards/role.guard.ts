import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private toastr: ToastrService,
    ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthorized(route);
  }

  private isAuthorized(route:ActivatedRouteSnapshot): boolean{
    // const roles = ['Admin', 'Manager'];
    const roles = [localStorage.getItem('CurrentRole')];
    const Roles = route.data.Roles;
    const roleMatches = roles.findIndex(role => Roles.indexOf(role) !== -1);
    if(roleMatches === -1){
      this.toastr.warning('You are not Anthorized this page!', 'Info.');
    }
    return roleMatches < 0 ? false : true;
  }
  
}

