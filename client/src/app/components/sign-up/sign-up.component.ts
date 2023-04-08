import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  
  constructor(private _auth : AuthService,
              private _router : Router){}
              
  signup(userData : NgForm){
    this._auth.signupUser(userData.value)
    .subscribe(
      res => {
        console.log(res.user)
        localStorage.setItem('token', res.jwt)
      },
      err => console.log(err)
    )
  }
}
