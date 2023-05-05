import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Group, Post, User } from '@roomv1/shared';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GroupService } from 'src/app/services/group/group.service';
import { NavbarService } from 'src/app/services/navbar/navbar.service';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-open-group',
  templateUrl: './open-group.component.html',
  styleUrls: ['./open-group.component.css']
})
export class OpenGroupComponent implements OnInit{

  group! : Group
  user! : User
  users : User[] = []
  posts! : Post[]
  joined = false
  constructor(private route: ActivatedRoute,
              private _groupService : GroupService,
              private _postService : PostService,
              public _auth : AuthService,
              private navbarService : NavbarService,
              private router : Router){}
  ngOnInit(){
    this.route.params.subscribe(params => {
      const groupId = params['id'];
      this._groupService.openGroup(groupId).subscribe(
        res =>{
          this.group = res.group
          this.listGroupUsers()
          this.getPosts()
          if(this._auth.loggedIn()) this.getUser()
        }
      )
    });
  }
  getUser(){
    this._auth.getUserById()
    .subscribe((res) =>{
       this.user = res.user
       this.checkUserGroup()
       this.checkUserRequest()
    },
    err => alert(err.message))
  }
  checkUserGroup(){
    for(let gId of this.user.groups!){
      if(this.group._id === gId){
        this.joined = true
        return true;
      }
    }
    this.joined = false
    return false
  }
  checkUserRequest(){
    for(let uId of this.group.usersIdDemandes!){
      if(uId === this.user._id)
        this.join = false
        return
    }
   this.join = true
  }
  join = true
  joinGroup(){
    if(!this._auth.loggedIn()){
      document.getElementById('isUserConnected')?.click()
      return 
    }
    this._groupService.sendGroupRequest({groupId : this.group._id!.toString()}).subscribe(
      res => {
        if(res.message) alert(res.message)
        if(res.error) alert(res.error)
        this.group.usersIdDemandes!.push(this.user._id!)
        this.join = !this.join
      }
    )

  }
  cancelRequest(){
    if(!this._auth.loggedIn()){
      document.getElementById('isUserConnected')?.click()
      return 
    }
    this._groupService.cancelGroupRequest({groupId : this.group._id!.toString()}).subscribe(
      res => {
        if(res.message) alert(res.message)
        if(res.error) alert(res.error)
        this.join = !this.join
      }
    )

  }
  leaveGroup(){
    if(!this._auth.loggedIn()) return 
    this._groupService.leaveGroup({groupId : this.group._id!.toString()}).subscribe(
      res => {
        if(res.message) alert(res.message)
        if(res.error) alert(res.error)
        this.joined = false
        this.join = true
      }
    )
  }

  //////
  listGroupUsers(){
    for(let userId of this.group.usersId!){
      this._auth.openUser(userId.toString()).subscribe(
        res => {
          this.users.push(res.user)
        },
        err => alert(err.message)
      )
    }
  }
///////////////////////////////////////////// Posts
  getPosts() {
    this._postService.listGroupPosts(this.group._id!.toString())
    .subscribe(
        res=> this.posts = res.posts,
        err => alert(err.message))
  }
  showPosts = false;
  togglePosts() {
    if(this.showPosts === false) this.getPosts();
    this.showPosts = !this.showPosts;
  }
  getPrivacy(post : Post){
    return post.privacy === 'public'
  }





/////////////////////////////////////////////////////////// Login
  login(credential:NgForm){
    document.getElementById('close-login')?.click();
    this._auth.loginUser(credential.value)
    .subscribe(
      res => {
        console.log(res.user)
        console.log(res.jwt)
        localStorage.setItem('token', res.jwt)
        this.navbarService.userName = res.user.userName
        this.navbarService.id = res.user._id
        this.navbarService.email = res.user.email
        this.navbarService.desc = res.user.description
        this.navbarService.psts = res.user.psts
        this.navbarService.grps = res.user.grps
        this.ngOnInit()
        // this._router.navigate(['/'])
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    ) 
  }    
  signUp(){
    this.router.navigate(['/sign-up/other'])
  }
}
