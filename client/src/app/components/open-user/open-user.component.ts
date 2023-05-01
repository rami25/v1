import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group, Like, Post, User } from '@roomv1/shared';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GroupService } from 'src/app/services/group/group.service';
import { NavbarService } from 'src/app/services/navbar/navbar.service';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-open-user',
  templateUrl: './open-user.component.html',
  styleUrls: ['./open-user.component.css']
})
export class OpenUserComponent implements OnInit{

  user! : User;
  posts! : Post[];
  groups! : Group[];
  constructor(private _postService : PostService,
              private _groupService : GroupService,
              private route: ActivatedRoute,
              private _auth : AuthService,
              private navbarService : NavbarService,
              private router : Router){}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      this.getUser(userId)
    });
  }
  getUser(userId : string){
    this._auth.openUser(userId)
    .subscribe((res) => this.user = res.user,
              err => alert(err.message))
  }



///////////////////////////////////////////// Posts
  getPosts() {
    // this._postService.getP()
    this._postService.getUserPosts(this.user._id!.toString())
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
///////////////////////////////////////////// Groups
  getGroups() {
    this._groupService.openUserGroups(this.user._id!.toString())
    .subscribe(
        (res:any)=> this.groups = res.groups,
        (err:HttpErrorResponse) => alert(err.message))
  }
  showGroups = false;
  toggleGroups() {
    if(this.showGroups === false) this.getGroups();
    this.showGroups = !this.showGroups;
  }



}
