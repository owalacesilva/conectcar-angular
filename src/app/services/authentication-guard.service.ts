import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as store from 'store';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const hasToken = !!store.get('token');

    if (!hasToken) {
      this.router.navigate(['/login']);
    }

    return hasToken;
  }
}
