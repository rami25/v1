import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group, Post, User } from '@roomv1/shared';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GroupService } from 'src/app/services/group/group.service';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-open-group',
  templateUrl: './open-group.component.html',
  styleUrls: ['./open-group.component.css']
})
export class OpenGroupComponent implements OnInit{

  group! : Group
  users : User[] = []
  posts! : Post[]
  constructor(private route: ActivatedRoute,
              private _groupService : GroupService,
              private _postService : PostService,
              private _auth : AuthService){}
  ngOnInit(){
    this.route.params.subscribe(params => {
      const groupId = params['id'];
      this._groupService.openGroup(groupId).subscribe(
        res =>{
          this.group = res.group
          this.listGroupUsers()
          this.getPosts()
        }
      )
    });
  }

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

}
