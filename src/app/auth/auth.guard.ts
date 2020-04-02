import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return this.authService.isAuth.pipe(tap((auth) => {
    //   if (!auth) {
    //     this.router.navigate(['/login']);
    //   }
    // }));
    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(['/tasks']);
    // }
    return this.authService.isLoggedIn();
  }
}
