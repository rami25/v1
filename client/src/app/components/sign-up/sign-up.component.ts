import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavbarService } from 'src/app/services/navbar/navbar.service';
import { Location } from '@angular/common';
import { UserDataCache } from 'src/app/userDataCache';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  
  constructor(private _auth : AuthService,
              private _router : Router,
              private route: ActivatedRoute,
              private navbarService: NavbarService,
              private location: Location,
              private cache : UserDataCache){}

              
  signup(userData : NgForm){
    this._auth.signupUser(userData.value)
    .subscribe(
      res => {
        console.log(res.user)
        localStorage.setItem('token', res.jwt)
        this.cache.userCache(res.user)
        const meta = this.route.snapshot.paramMap.get('meta');
        // this.route.params.subscribe(params => {
        //   const meta = params['meta'];
          console.log('meta',meta)
          if(meta === 'other'){
            this.location.back();
            return
          }
          if(meta === 's')
            this._router.navigate(['/home'])
        // })
      },
      err => console.log(err)
    )
  }
}
