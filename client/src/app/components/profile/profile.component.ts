import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Group, ListPostsResponse, Post, User } from '@roomv1/shared';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GroupService } from 'src/app/services/group/group.service';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user! : User;
  posts! : Post[];
  groups! : Group[];
  meta!: string;
  constructor(public _auth : AuthService,
              private _postService : PostService,
              private _groupService : GroupService,
              private route : ActivatedRoute,
              private _router : Router){
    _auth.getUserById()
    .subscribe((res) => this.user = res.user,
              err => alert(err.message))
  }
  ngOnInit(): void {
    this._router.events.subscribe(event => {
      // if(event instanceof NavigationEnd){
        this.route.params.subscribe(params => {
          // this.meta = fragment as string
          this.meta = params['meta'];
        });
        if(this.meta === 'posts' && this.showPosts === false){
          this.getPosts()
          document.getElementById('posts')?.scrollIntoView();
          if(this.showGroups === true) this.toggleGroups()
          this.togglePosts()
        }
        if(this.meta === 'groups' && this.showGroups === false){
          this.getGroups()
          document.getElementById('groups')?.scrollIntoView();
          if(this.showPosts === true) this.togglePosts()
          this.toggleGroups()
        }
        if(this.meta === 'profile'){
          if(this.showPosts === true)
             this.togglePosts()
          if(this.showGroups === true)
             this.toggleGroups()
        }
      // }
    })

  }

///////////////////////////////////////////// Posts
  getPosts() {
    // this._postService.getUserPosts(this.user._id!.toString())
    this._postService.getP()
    .subscribe(
        res=> this.posts = res.posts,
        err => alert(err.message))
  }
  showPosts = false;
  togglePosts() {
    this.getPosts();
    this.showPosts = !this.showPosts;
  }
///////////////////////////////////////////// Groups
  getGroups() {
    this._groupService.getUserGroups()
    .subscribe(
        res=> this.groups = res.groups,
        err => alert(err.message))
  }
  showGroups = false;
  toggleGroups() {
    this.getGroups();
    this.showGroups = !this.showGroups;
  }

}
