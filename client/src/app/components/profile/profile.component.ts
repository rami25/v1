import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Post, User } from '@roomv1/shared';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user! : User;
  posts! : Post[];
  meta!: string;
  constructor(public _auth : AuthService,
              private _postService : PostService,
              private route : ActivatedRoute,
              private _router : Router){
    _auth.getUserById()
    .subscribe(res => this.user = res.user,
              err => alert(err.message))
  }
  ngOnInit(): void {
    this.getPosts()
    this._router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        this.route.params.subscribe(params => {
          this.meta = params['meta'];
        });
        if(this.meta === 'posts' && this.showPosts === false)
              this.togglePosts()
        if(this.meta === 'profile' && this.showPosts === true)
              this.togglePosts()
      }
    })

  }

  getPosts() {
    this._postService.getUserPosts()
    .subscribe(
        res=> this.posts = res.posts,
        err => alert(err.message))
  }

  showPosts = false;

  togglePosts() {
    this.showPosts = !this.showPosts;
  }

}
