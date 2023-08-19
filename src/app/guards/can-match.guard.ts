import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanMatchGuard implements CanMatch {

  canMatch(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthorized(route);;
  }

  private isAuthorized(route:Route): boolean{
    const roles = [localStorage.getItem('CurrentRole')];
    const Roles = route.data.Roles;
    const roleMatches = roles.findIndex(role => Roles.indexOf(role) !== -1);
    return roleMatches < 0 ? false : true;
  }

}
