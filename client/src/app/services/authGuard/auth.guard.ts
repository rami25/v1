import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    constructor(private _authService: AuthService,
                private _router: Router) { } 
    public check = false;            
    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this._authService.loggedIn()) {
        console.log('true')
        this.check = true
        return true
      } else {
        console.log('false')            
        this._router.navigate(['/log-in'])
        this.check = false
        return false
      }
    }
}
