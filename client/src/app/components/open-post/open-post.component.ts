import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Like, Post, User , Comment} from '@roomv1/shared';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavbarService } from 'src/app/services/navbar/navbar.service';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-open-post',
  templateUrl: './open-post.component.html',
  styleUrls: ['./open-post.component.css']
})
export class OpenPostComponent implements OnInit{
  post! : Post;
  user! : User;
  comments! : Comment[];
  comment! : Comment;
  nComment! : number
  stars! : Like[]
  nStar! : number
  constructor(private _postService : PostService,
              private route: ActivatedRoute,
              private _auth : AuthService,
              private navbarService : NavbarService,
              private router : Router){}
  getUser(){
    this._auth.getUserById()
    .subscribe((res) => this.user = res.user,
              err => alert(err.message))
  }
  ngOnInit(){
    if(this._auth.loggedIn()){
      this.getUser()
    }
    this.route.params.subscribe(params => {
      const postId = params['id'];
      this._postService.getOnePost(postId).subscribe(
        res => { 
          this.post = res.post
          this.listLinks(this.post.urls)
          this.listComments()
          this.getStars()
        }
      )
    });
  }
  //////////////////////////////////////////////////////////////////Links
  linksWithIndexes:any[] = []
  listLinks(links : string[]){
    let counter = 1
    for(let link of links){
      this.linksWithIndexes.push({index : counter, value : link})
      counter++
    }
  }
  copyToClipBoard(link : string){
    navigator.clipboard.writeText(link)
  }
  /////////////////////////////////////////////////////////////////////////////////////////// Comment
  listComments() {
    this._postService.listComments({ postId : this.post._id!.toString()})
    .subscribe(
      res => {
         this.comments = res.comments
         this.nComment = this.comments.length
      },
      err => alert(err.message)
    )
  }
  //////////////////////// Comment
  catchComment(comment : Comment){
    this.comment = comment
  }
  showComments = false
  toggleComments() {
    this.showComments = !this.showComments
    if(this.showComments)
      this.listComments()
  }
  showNewComment = false
  toggleNewComment() {
    this.showNewComment = !this.showNewComment
    this.isComment = false
  }
  isComment = false
  checkComment(){
    const input = document.getElementById('commentVal') as HTMLTextAreaElement
    const commentVal = input.value 
    if(commentVal !== '') 
      this.isComment = true
    else this.isComment = false  
  }
  addComment(commentForm : NgForm) {
    this.showNewComment = false
    this.isComment = false
    commentForm.value.postId = this.post._id
    this.nComment++
    this._postService.addComment(commentForm.value)
    .subscribe(
      res => this.listComments()
    )
  }
  checkCommentUser(comment : Comment){
    if(this._auth.loggedIn())
      return comment.userId === this.user._id
    return false
  }
  deleteComment(){
    this.nComment--
    this._postService.deleteComment({postId : this.post._id!.toString(),
                                     commentId : this.comment._id!.toString()}).subscribe()
                                     
    for(let i = 0; i < this.comments.length; i++){
      if(this.comments[i]._id === this.comment._id){
        this.comments.splice(i,1)
        break
      }
    }
  }
  showUpdateComment = false
  toggleUpdateComment(comment : Comment){
    this.isEmpty = true
    this.showUpdateComment = !this.showUpdateComment  
    if(this.showUpdateComment)
      this.comment = comment
  }
  isEmpty = true
  checkContent(){
    const input = document.getElementById('updateContent') as HTMLTextAreaElement
    const commentVal = input.value 
    if(commentVal !== '') 
      this.isEmpty = false
    else this.isEmpty = true  
  }
  thisComment(comment : Comment){
    return this.comment === comment
  }
  updateComment(){
    this.showUpdateComment = false
    if(this.comment.content !== ''){
      this._postService.updateComment({commentId : this.comment._id!.toString() , content : this.comment.content}).subscribe()
    }
  }
  /////////////////////////////////////////////////////////////////////////////////// Stars
  getStars(){
    this._postService.listStars({ postId : this.post._id!.toString()})  
    .subscribe(
      res => {
        this.stars = res.likes
        this.nStar = this.stars.length
        this.checkUserStar()
      },
      err => alert(err.message)
    )
  }
  checkUserStar(){
    for(let star of this.stars){
      if(star.userId === this.user._id){
        this.star = true
        return
      }
    }
    this.star = false
  }
  star = false
  addStar(){
    if(!this._auth.loggedIn()){
      document.getElementById('isStarConnected')?.click()
      return 
    }
    this.star = !this.star
    if(this.star){
      this._postService.addStar({postId : this.post._id!.toString()}).subscribe()
      // this.getStars()
      this.nStar++
    }
    else{
      this._postService.removeStar({postId : this.post._id!.toString()}).subscribe(
        res => console.log(res.check)
      )
      // this.getStars()
      this.nStar--
    }
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
