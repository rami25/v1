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
  showUser! : User;
  users : User[] = [];
  searchResult : User[] = [];
  posts! : Post[];
  showPost! :Post;
  postStars! : Like[];
  nStars! : number;
  comments! : Comment[];
  comment! : Comment;
  groups! : Group[];
  showGroup! : Group;
  groupUsers! : User[];
  groupPosts! : Post[];
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
          this._router.navigate(['/'])
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
    // this.resetLinks()
    // this.resetFiles()
    this.showComments = false
    this.showNewComment = false
    this.isComment = false
    this.openGPost = false
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
        this._postService.checkStar({ postId : this.showPost._id!.toString()})
        .subscribe(
          res => this.star = res.exists,
          err => alert(err.message)
        )
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
    this.resetLinks()
    this.resetFiles()
    this.showPost = post;
    if(post.urls.length !== 0)
      this.reverseCloneLinks(post.urls)
    if(post.files.length !== 0)
      this.reverseCloneFiles(post.files)
    this.getStars()  
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
          this.getGroups()
          document.getElementById('closeGroupModal')?.click()
        }
        if(res.error) alert(res.error)
      },
      err => alert(err.message)
    )
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////// Comment
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
  @ViewChild('ulink') ulink!: ElementRef;
  appendLinksList(){
    const val = this.ulink.nativeElement.value
    console.log('link : ',val)
    if(val !== ''){
      const exist = this.showedLinks.find(l => { return l.value === val})
      if(exist) alert('this link is already exist')
      else {
        this.showedLinks.push({key : this.i , value : this.ulink.nativeElement.value })
        this.i+=1
        this.ulink.nativeElement.value = '';
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
    this.i = 0;
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
  @ViewChild('ufile') ufile!: ElementRef;
  appendFilesList(){
    const val = this.ufile.nativeElement.value
    if(val !== ''){
      const exist = this.showedFiles.find(f => { return f.value === val})
      if(exist) alert('this file is already exist')
      else {
        this.showedFiles.push({key : this.j , value : val})
        this.j+=1
        this.ufile.nativeElement.value = '';
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
    this.j = 0;
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
    console.log('update-post :' ,postData.value)
    this._postService.updatePost(postData.value)
    .subscribe(
      res => {
        if(res.message){
          alert(res.message)
          this._router.navigate([`/user/${this.user._id}/profile`])
          this.getUser()
          document.getElementById('closeGroupModal')?.click()
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
  clearGroup(){
    const updateGroup = document.getElementById('updateGroupForm') as HTMLFormElement
    updateGroup.reset()
    this.groupUsers = []
    this.groupPosts = []
    this.showGroupPosts = false;
  }
  getGroups() {
    this._groupService.getUserGroups()
    .subscribe(
        res=> {
          this.groups = res.groups
        },
        err => alert(err.message))
  }
  nGroupPost : number = 0
  getGroupPosts() {
    this._postService.listGroupPosts(this.showGroup._id!.toString())
    .subscribe(
        res=> {
          this.groupPosts = res.posts
          this.nGroupPost = this.groupPosts.length
        },
        err => alert(err.message))
  }
  listGroupUsers(){
    this.groupUsers = []
    this._auth.listGroupUsers(this.showGroup._id!.toString()).subscribe(
      res => {
        this.groupUsers = res.users
        console.log('group users : ', this.groupUsers)
      },err => alert(err.message)
    )
    // for(let userId of this.showGroup.usersId!){
    //   this._auth.openUser(userId.toString()).subscribe(
    //     res => {
    //       this.groupUsers.push(res.user)
    //     },
    //     err => alert(err.message)
    //   )
    // }
  }
  catchGroup(group : Group){
    this.showGroup = group
    this.nGroupPost = this.showGroup.psts!
    // this.listGroupUsers()
  }
  showGroups = false;
  toggleGroups() {
    if(this.showGroups === false) this.getGroups();
    this.showGroups = !this.showGroups;
  }
  showGroupPosts = false;
  toggleGroupPosts() {
    if(this.showGroupPosts === false) this.getGroupPosts();
    this.showGroupPosts = !this.showGroupPosts;
  }

  deleteGroup(){
    if(this.showGroup.userAdmin !== this.user._id){
      alert('only the group admin can delete this group')
      return
    }
    this._groupService.deleteGroup({groupId : this.showGroup._id!.toString()}).subscribe(
      res => {
        if(res.message){
          alert(res.message)
          document.getElementById('closeGroupModal')?.click()
          this._router.navigate([`/user/${this.user._id}/profile`])
          this.getUser()
        }
        if(res.error) alert(res.error)
      },
      err => alert(err.message)     
    )
  }

  updateGroup(groupForm : NgForm) {
    if(this.showGroup.userAdmin !== this.user._id){
      alert('only the group admin can update this group')
      return
    }
    groupForm.value.groupId = this.showGroup._id 
    if(!groupForm.value.groupName || groupForm.value.groupName === ' ')
      groupForm.value.groupName = this.showGroup.groupName
    if(!groupForm.value.description || groupForm.value.description === ' ')
      groupForm.value.description = this.showGroup.description
    this._groupService.updateGroup(groupForm.value).subscribe(
      res => {
        if(res.message){
          document.getElementById('update-group')?.click()
          alert(res.message)
          document.getElementById('closeGroupModal')?.click()
          this._router.navigate([`/user/${this.user._id}/profile`])
          this.getUser()
        }
        if(res.error) alert(res.error)
      },
      err => alert(err.message)
    )
  }

  createGroupPost(postData : NgForm){
    document.getElementById('create-group-post')?.click()
    this.cloneLinks()
    this.cloneFiles()
    postData.value.urls = this.links
    postData.value.files = this.files
    postData.value.groupId = this.showGroup._id
    console.log(postData.value)
    this._postService.createPost(postData.value)
    .subscribe(
      res => {
        if(res.message) alert(res.message)
        if(res.gpsts) this.nGroupPost = res.gpsts
        this.navbarService.psts = res.psts
        this.getGroupPosts()
        // this._router.navigate([`/user/${this.user._id}/profile`])
        this.getUser()
        const createPostForm = document.getElementById('createPostForm') as HTMLFormElement
        createPostForm.reset()
        this.resetLinks()
        this.resetFiles()
      },
      err => alert(err.message)
    )
  }
  checkUserPost(post : Post) : boolean {
    return post.userId === this.user._id
  }
  openGPost = false
  openGroupPost(post : Post){
    this.clear()
    this.openGPost = true
    this.catchPost(post)
    console.log('post :', post)
    document.getElementById('openPost')?.click()
  }

  listUsers(){
    this._auth.listUsers()
    .subscribe(
      res => {
        this.users = res.users
      }
    )
  }
  ///////////////////// interact
  isResult = false
  searchUser(key : string){
    if(key === ''){
      this.isResult = false
      this.searchResult = []
      return
    }
    const results = this.getResult(key)
    if(results.length !== 0){
      this.searchResult = results
      this.isResult = true
    }
  }

  getResult(query : string){
    let results: User[] = []
    results = this.users.filter(item => item.userName!.toLowerCase().includes(query.toLowerCase()))
    return results
  }

  notBelongToGroup(user : User) : boolean {
    for(let uId of this.showGroup.usersId!){
      if(uId === user._id)
        return false
    }
    return true
  }

  catchUser(user : User){
    this.showUser = user
    this.invite = this.checkUserInvitation(user)? true : false
  }

  checkUserInvitation(user : User) : boolean {
    // console.log('user :', user.userName)
    // console.log('group req : ', this.showGroup.usersIdRequests)
    for(let uId of this.showGroup.usersIdRequests!){
      // console.log('userId : ' , uId)
      // console.log('compare : ', uId === user._id)
      if(uId === user._id){
        return false
      }
    }
    return true
  }
  invite = true
  inviteUserToGroup(){
    this._groupService.inviteUserToGroup({groupId : this.showGroup._id!.toString(), profileId : this.showUser._id!.toString()}).subscribe(
      res => {
        if(res.message) alert(res.message)
        if(res.error) alert(res.error)
        this.showGroup.usersIdRequests!.push(this.showUser._id!)
        this.invite = !this.invite
      }
    )
  }




  removeGroupRequest(){
    this._groupService.removeUserInvitation({groupId : this.showGroup._id!.toString(), profileId : this.showUser._id!.toString()}).subscribe(
      res => {
        if(res.message) alert(res.message)
        if(res.error) alert(res.error)
        if(this.showGroup.usersIdRequests!.length !== 0)
          this.removeUserId(this.showUser)
        this.invite = !this.invite
      }
    )
  }

  rejectUserFromGroup(user : User){

  }

  


  removeUserId(user : User){
    for (let i = 0; i < this.showGroup.usersIdRequests!.length; i++) {
      if (this.showGroup.usersIdRequests![i] === user._id) {
        this.showGroup.usersIdRequests!.splice(i, 1);
        break;
      }
    }
  }




}