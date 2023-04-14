// import { User } from '@roomv1/shared'
import { Component,  OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { NavbarService } from './services/navbar/navbar.service';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PostService } from './services/post/post.service';
import { GroupService } from './services/group/group.service';
import { AuthGuard } from './services/authGuard/auth.guard';
import { DataService } from './services/data/data.service';

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
              public _guard : AuthGuard,
              private _postService : PostService,
              private _groupService : GroupService,
              private navbarService: NavbarService,
              public _data : DataService) {}

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
  ///////////////////////////////////////// User
  
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
  ///////////////////////////////////////// Post

  createPost(postData : NgForm){
    document.getElementById('create-post')?.click();
    this._postService.createPost(postData.value)
    .subscribe(
      res => console.log(res.error),
      err => alert(err.message)
    )
  }

  ///////////////////////////////////////// Group

  createGroup(groupData : NgForm){
    document.getElementById('create-group')?.click();
    this._groupService.createGroup(groupData.value)
    .subscribe(
      res => console.log(res.error),
      err => alert(err.message)
    )

  }
}
