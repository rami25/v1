import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private _auth : AuthService,
              private _router : Router) {}
              
  login(credential:NgForm){
    this._auth.loginUser(credential.value)
    .subscribe(
      res => {
        console.log(res.user)
        console.log(res.jwt)
        localStorage.setItem('token', res.jwt)
        console.log('error',res.error)
        // this._router.navigate(['/special'])
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
        console.log(error)
      }
    ) 
    console.log('done')
  }             
}
