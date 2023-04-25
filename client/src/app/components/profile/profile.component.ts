import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute,  Router } from '@angular/router';
import { Group, Like, Post, User , Comment} from '@roomv1/shared';
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
  postStars! : Like[];
  nStars! : number;
  comments! : Comment[];
  comment! : Comment;
  groups! : Group[];
  meta!: string;
  getUser(){
    this._auth.getUserById()
    .subscribe((res) => this.user = res.user,
              err => alert(err.message))
  }
  constructor(public _auth : AuthService,
              private _postService : PostService,
              private _groupService : GroupService,
              private route : ActivatedRoute,
              private _router : Router,
              private navbarService : NavbarService){
              this.getUser()
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
  clear(){
    const updateForm = document.getElementById('updateForm') as HTMLFormElement
    updateForm.reset()
    this.showComments = false
    this.showNewComment = false
    this.isComment = false
  }
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
  getStars(){
    this._postService.listStars({ postId : this.showPost._id!.toString()})  
    .subscribe(
      res => {
        this.postStars = res.likes
        this.nStars = this.postStars.length
      },
      err => alert(err.message)
    )
  }
  listComments() {
    this._postService.listComments({ postId : this.showPost._id!.toString()})
    .subscribe(
      res => {
         this.comments = res.comments
         this.nComment = this.comments.length
      },
      err => alert(err.message)
    )
  }
  catchPost(post: Post){
    this.showPost = post;
    if(post.urls.length !== 0)
      this.reverseCloneLinks(post.urls)
    if(post.files.length !== 0)
      this.reverseCloneFiles(post.files)
    this.getStars()  
    this._postService.checkStar({ postId : this.showPost._id!.toString()})
    .subscribe(
      res => this.star = res.exists,
      err => alert(err.message)
    )
    this.listComments()
  }
  getPrivacy(post : Post){
    return post.privacy === 'public'
  }
  star = false
  addStar(){
    this.star = !this.star
    if(this.star){
      this._postService.addStar({postId : this.showPost._id!.toString()}).subscribe()
      // this.getStars()
      this.nStars++
    }
    else{
      this._postService.removeStar({postId : this.showPost._id!.toString()}).subscribe(
        res => console.log(res.check)
      )
      // this.getStars()
      this.nStars--
    }
  }
  deletePost(){
    this._postService.deleteUserPost({postId : this.showPost._id!.toString()})
    .subscribe(
      res => {
        if(res.message){
          alert(res.message)
          this._router.navigate([`/user/${this.user._id}/profile`])
          // this.navbarService.psts = res.psts
          this.getUser()
        }
        if(res.error) alert(res.error)
      },
      err => alert(err.message)
    )
  }
  //////////////////////// Comment
  showComments = false
  toggleComments() {
    this.showComments = !this.showComments
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
  nComment! : number
  addComment(commentForm : NgForm) {
    this.showNewComment = false
    this.isComment = false
    commentForm.value.postId = this.showPost._id
    this.nComment++
    this._postService.addComment(commentForm.value)
    .subscribe(
      res => this.listComments()
    )
  }
  checkCommentUser(comment : Comment){
    return comment.userId === this.user._id
  }
  deleteComment(comment : Comment){
    this.comment = comment
    this.nComment--
    this._postService.deleteComment({postId : this.showPost._id!.toString(),
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
////////////////////////////////////////////////////////////////////////////////////////// update post
  links: string[] = []
  showedLinks : any[] = []
  i: number = 0
  @ViewChild('link') link!: ElementRef;
  appendLinksList(){
    const val = this.link.nativeElement.value
    if(val !== ''){
      const exist = this.showedLinks.find(l => { return l.value === val})
      if(exist) alert('this link is already exist')
      else {
        this.showedLinks.push({key : this.i , value : this.link.nativeElement.value })
        this.i+=1
        this.link.nativeElement.value = '';
      }
    }
  }
  removeLink(key:number){
    // let lb:number = 0 
    // let rb:number = this.showedLinks.length
    // while(lb <= rb){
    //   let mid = (lb+rb)/2
    //   if(key === this.showedLinks[mid].key){
    //     this.showedLinks.splice(mid, 1);
    //     break;
    //   }
    //   else if(key < this.showedLinks[mid].key)
    //     rb-=1;
    //   else lb+=1
    // }
    for (let i = 0; i < this.showedLinks.length; i++) {
      if (this.showedLinks[i].key === key) {
        this.showedLinks.splice(i, 1);
        break;
      }
    }
  }

  resetLinks(){
    this.links = []
    this.showedLinks = []
  }
  cloneLinks(){
    for(let Link of this.showedLinks)
      this.links.push(Link.value)
  }
  
  reverseCloneLinks(urls : string[]){
    this.resetLinks()
    for(let url of urls){
      this.showedLinks.push({key : this.i , value : url})
      this.i++
    }
  }



  files: string[] = []
  showedFiles : any[] = []
  j: number = 0
  @ViewChild('file') file!: ElementRef;
  appendFilesList(){
    const val = this.file.nativeElement.value
    if(val !== ''){
      const exist = this.showedFiles.find(f => { return f.value === val})
      if(exist) alert('this file is already exist')
      else {
        this.showedFiles.push({key : this.j , value : val})
        this.j+=1
        this.file.nativeElement.value = '';
      }
    }
  }
  removeFile(key:number){
    for (let i = 0; i < this.showedFiles.length; i++) {
      if (this.showedFiles[i].key === key) {
        this.showedFiles.splice(i, 1);
        break;
      }
    }
  }

  resetFiles(){
    this.files = []
    this.showedFiles = []
  }
  cloneFiles(){
    for(let File of this.showedFiles)
      this.files.push(File.value)
  }
  reverseCloneFiles(files : string[]){
    this.resetFiles()
    for(let file of files){
      this.showedFiles.push({key : this.j , value : file})
      this.j++
    }
  }
  updatePost(postData : NgForm){
    document.getElementById('update-post')?.click();
    this.cloneLinks()
    this.cloneFiles()
    if(!postData.value.title || postData.value.title === ' ')
       postData.value.title = this.showPost.title
    if(!postData.value.description)
       postData.value.description = this.showPost.description
    if(!postData.value.privacy)
       postData.value.privacy = this.showPost.privacy
    postData.value.urls = this.links
    postData.value.files = this.files
    postData.value.postId = this.showPost._id
    // console.log(postData.value)
    this._postService.updatePost(postData.value)
    .subscribe(
      res => {
        if(res.message){
          alert(res.message)
          this._router.navigate([`/user/${this.user._id}/profile`])
          this.getUser()
        }
        if(res.error) alert(res.error)
      },
      err => alert(err.message)
    )
    // postData.value.title = undefined
    // postData.value.description = undefined
    // postData.value.privacy = undefined
    // this.resetLinks()
    // this.resetFiles()

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
