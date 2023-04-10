import { Component } from '@angular/core';
import { User } from '@roomv1/shared';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user! : User;
  constructor(public _auth : AuthService){
    _auth.getUserById()
    .subscribe(res => this.user = res.user,
              err => alert(err.message))
  }

}
