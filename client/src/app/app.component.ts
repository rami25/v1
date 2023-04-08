// import { User } from '@roomv1/shared'
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { LoginComponent } from './components/login/login.component';
import { NavbarService } from './services/navbar/navbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  id : string = '';
  userName : string = '';
  constructor(public _authService : AuthService,
              private navbarService: NavbarService) {}

  ngOnInit(): void {
    this.navbarService._userName$.subscribe(name => {
      this.userName = name;
    });
    this.navbarService._id$.subscribe(id => {
      this.id = id;
    });
  }
}
