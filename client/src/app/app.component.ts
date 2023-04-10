// import { User } from '@roomv1/shared'
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { LoginComponent } from './components/login/login.component';
import { NavbarService } from './services/navbar/navbar.service';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  id : string = '';
  userName : string = '';
  email : string = '';
  description : string ='';
  constructor(public _authService : AuthService,
              private navbarService: NavbarService) {}

  ngOnInit(): void {
    this.navbarService._userName$.subscribe(name => {
      this.userName = name;
    });
    this.navbarService._id$.subscribe(id => {
      this.id = id;
    });
    this.navbarService._email$.subscribe(email => {
      this.email = email;
    });
    this.navbarService._description$.subscribe(desc => {
      this.description = desc;
    });
  }
  
  updateUser(userData: NgForm){
    document.getElementById('update-user')?.click();
    this._authService.updateUser(userData.value)
    .subscribe(
      res => {
        this.navbarService.userName = res.user.userName
        this.navbarService.email = res.user.email
        this.navbarService.desc = res.user.description
        console.log(res.user.description)
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }
}
