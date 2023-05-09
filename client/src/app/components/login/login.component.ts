import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NavbarService } from 'src/app/services/navbar/navbar.service';
import { GroupService } from 'src/app/services/group/group.service';
import { Group, User } from '@roomv1/shared';
import { UserDataCache } from 'src/app/userDataCache';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(public _auth : AuthService,
              private _router : Router,
              private navbarService: NavbarService,
              private groupService : GroupService,
              private cache : UserDataCache) {}
              
  login(credential:NgForm){
    this._auth.loginUser(credential.value)
    .subscribe(
      res => {
        console.log(res.user)
        console.log(res.jwt)
        localStorage.setItem('token', res.jwt)
        this.cache.userCache(res.user)
        this._router.navigate(['/'])
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    ) 
  }             

}
