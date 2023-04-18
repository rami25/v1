import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute,  Router } from '@angular/router';
import { Group, Post, User } from '@roomv1/shared';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GroupService } from 'src/app/services/group/group.service';
import { NavbarService } from 'src/app/services/navbar/navbar.service';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user! : User;
  posts! : Post[];
  showPost! :Post;
  groups! : Group[];
  meta!: string;
  constructor(public _auth : AuthService,
              private _postService : PostService,
              private _groupService : GroupService,
              private route : ActivatedRoute,
              private _router : Router,
              private navbarService : NavbarService){
    _auth.getUserById()
    .subscribe((res) => this.user = res.user,
              err => alert(err.message))
  }
  deleteAccount(deleteForm : NgForm){
    this._auth.deleteAccount(deleteForm.value)
    .subscribe(
      res => {
        if(res.message){
          alert(res.message)
          this._auth.logoutUser()
        }
        if(res.error)
          alert(res.error)

      },
      err => alert(err.message)
    )
  }
  ngOnInit(): void {
    this._router.events.subscribe(event => {
      // if(event instanceof NavigationEnd){
        this.route.params.subscribe(params => {
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

    this.navbarService._userName$.subscribe(name => {
      this.user.userName = name;
    });
    this.navbarService._email$.subscribe(email => {
      this.user.email = email;
    });
    this.navbarService._description$.subscribe(desc => {
      this.user.description = desc;
    });
    this.navbarService._psts$.subscribe(psts => {
      this.user.psts = psts;
    });
    this.navbarService._grps$.subscribe(grps => {
      this.user.grps = grps;
    });

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
    if(this.showPosts === false) this.getPosts();
    this.showPosts = !this.showPosts;
  }
  catchPost(post: Post){
    this.showPost = post;
    console.log(this.showPost)
  }
  getPrivacy(post : Post){
    return post.privacy === 'public'
  }
  star = false
  addStar(){
    this.star = !this.star
  }
  showComments = false
  toggleComments() {
    this.showComments = !this.showComments
  }
  deletePost(){
    this._postService.deleteUserPost({postId : this.showPost._id!.toString()})
    .subscribe(
      res => {
        if(res.message){
          alert(res.message)
          this._router.navigate([`/user/${this.user._id}/profile`])
          this._auth.getUserById()
          .subscribe((res) => this.user = res.user,
              err => alert(err.message))
        }
        if(res.error) alert(res.error)
      },
      err => alert(err.message)
    )
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
    if(this.showGroups === false) this.getGroups();
    this.showGroups = !this.showGroups;
  }




}
