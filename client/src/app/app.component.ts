import { Component,  ElementRef,  OnInit, ViewChild } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { NavbarService } from './services/navbar/navbar.service';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PostService } from './services/post/post.service';
import { GroupService } from './services/group/group.service';
import { AuthGuard } from './services/authGuard/auth.guard';
import { environment } from 'src/environments/environment';
import { Group, Post, User } from '@roomv1/shared';
import { UserDataCache } from './userDataCache';

interface userRequest {
  userId? : any;
  userName? : string;
  groupId : any;
  groupName : string;
}

interface notification {
  message : string;
  notedAt : Date;
}

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
  filter : string = 'Post'
  isResults = true
  bufferKey : string = '';
  posts : Post[] = []
  users : User[] = []
  groups : Group[] = []
  results : any[] = []
  usersRequests : userRequest[] = []
  groupRequests : userRequest[] = []
  nRequests : number = 0
  notifications! : notification[]
  notif : number = 0
  invitations : userRequest[] = []
  groupInvitations : userRequest[] = []
  invi : number = 0
  constructor(public _authService : AuthService,
              public _guard : AuthGuard,
              private _postService : PostService,
              private _groupService : GroupService,
              private navbarService: NavbarService,
              private http : HttpClient,
              private cache : UserDataCache) {}

  ngOnInit(): void {
    if(this._authService.loggedIn()){
      this._authService.getUserById().subscribe(
        res => this.cache.userCache(res.user)
      )
    }
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

    ////////// group Requests
    this.navbarService._groupRequests$.subscribe(array => {
      this.groupRequests = array;
    });
    ////////// users Requests
    this.navbarService._usersRequests$.subscribe(array => {
      this.usersRequests = array;
    });
    this.navbarService._nRequests$.subscribe(n => {
      this.nRequests = n;
    });
    /////////////////////////// notifications
    this.navbarService._notifications$.subscribe(array => {
      this.notifications = array;
      this.sortNotif()
    });
    this.navbarService._notif$.subscribe(n => {
      this.notif = n;
    });
    /////////////////////////// group invitations
    this.navbarService._groupInvitations$.subscribe(array => {
      this.groupInvitations = array;
    });
    /////////////////////////// invitations
    this.navbarService._invitations$.subscribe(array => {
      this.invitations = array;
    });
    this.navbarService._invi$.subscribe(n => {
      this.invi = n;
    });
    //////////////////////////////////
    this._postService.listPublicPosts()
    .subscribe(
      res => {
        this.posts = res.posts
      }
    )
    this._authService.listUsers()
    .subscribe(
      res => {
        this.users = res.users
      }
    )
    this._groupService.listGroups()
    .subscribe(
      res => {
        this.groups = res.groups
      }
    )


  }
  ////////////////////////////////////////////////////// Search bar
  changeFilter(filter : string){
    this.filter = filter
    this.search(this.bufferKey)
  }
  search(key : string){
    this.bufferKey = key
    const res = document.getElementById('result')
    if(key === ''){
      this.isResults = false
      this.results = []
      res!.classList.remove('resultBorder');
      return
    }
    this.isResults = true
    const results = this.getResults(key, this.filter)
    if(results.length !== 0){
      res!.classList.add('resultBorder');
      this.results = results
    }
    
  }
  getResults(query: string, filter : string) {
    let results: any[] = []
    if(filter === 'Post'){  
      results = this.posts.filter(item => item.title!.toLowerCase().includes(query.toLowerCase()) ||
                                          item.description!.toLowerCase().includes(query.toLowerCase()));
    }
    if(filter === 'User'){  
      results = this.users.filter(item => item.userName!.toLowerCase().includes(query.toLowerCase()) ||
                                          item.description!.toLowerCase().includes(query.toLowerCase()));
    }
    if(filter === 'Group'){  
      results = this.groups.filter(item => item.groupName!.toLowerCase().includes(query.toLowerCase()) ||
                                           item.description!.toLowerCase().includes(query.toLowerCase()));
    }
    return results;
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
  links: string[] = []
  showedLinks : any[] = []
  i: number = 0
  @ViewChild('link', { static: true }) link!: ElementRef;
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
  files: string[] = []
  showedFiles : any[] = []
  j: number = 0
  @ViewChild('file', { static: true }) file!: ElementRef;
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
  createPost(postData : NgForm){
    document.getElementById('create-post')?.click();
    this.cloneLinks()
    this.cloneFiles()
    postData.value.urls = this.links
    postData.value.files = this.files
    this._postService.createPost(postData.value)
    .subscribe(
      res => {
        if(res.message) alert(res.message)
        this.navbarService.psts = res.psts
        const updateForm = document.getElementById('createPostForm') as HTMLFormElement
        updateForm.reset()
        this.resetLinks()
        this.resetFiles()
      },
      err => alert(err.message)
    )
  }

  ///////////////////////////////////////// Group

  createGroup(groupData : NgForm){
    document.getElementById('create-group')?.click();
    this._groupService.createGroup(groupData.value)
    .subscribe(
      res => {
        if(res.message) alert(res.message)
        this.navbarService.grps = res.grps
      },
      err => alert(err.message)
    )
  }




    /////////////////////////////////////////////////////////// Interact
    acceptUserRequest(req : userRequest){
      this._groupService.acceptUserRequest({groupId : req.groupId , profileId : req.userId}).subscribe(
        res => {
          if(res.message) alert(res.message)
          this.spliceRequest(req)
        },err => alert(err.message)
      )
    }
    deleteUserRequest(req : userRequest){
      this._groupService.deleteUserRequest({groupId : req.groupId , profileId : req.userId}).subscribe(
        res => {
          if(res.message) alert(res.message)
          this.spliceRequest(req)
        },err => alert(err.message)
      )
    }
    spliceRequest(req : userRequest){
      for(let i = 0; i < this.usersRequests.length; i++){
        if(this.usersRequests[i].userId === req.userId &&
           this.usersRequests[i].groupId === req.groupId){
            this.usersRequests.splice(i,1)
            this.nRequests -=1
            break
           }
      }
    }

    acceptGroupRequest(req : userRequest){
      this._groupService.acceptGroupRequest({groupId : req.groupId}).subscribe(
        res => {
          if(res.message) alert(res.message)
          if(res.error) alert(res.error)
          this.spliceGroupRequest(req)
        },err => alert(err.message)
      )
    }

    deleteGroupRequest(req : userRequest){
      this._groupService.deleteGroupRequest({groupId : req.groupId}).subscribe(
        res => {
          if(res.message) alert(res.message)
          if(res.error) alert(res.error)
          this.spliceGroupRequest(req)
        },err => alert(err.message)
      )
    }
    spliceGroupRequest(req : userRequest){
       for(let i = 0; i < this.groupRequests.length; i++){
        if(this.groupRequests[i].userId === req.userId &&
           this.groupRequests[i].groupId === req.groupId){
            this.groupRequests.splice(i,1)
            this.nRequests -=1
            break
           }
      }     
    }
    ///////////////////////////////////// Invitations
    deleteUserInvitation(invi : userRequest){
    this._groupService.removeUserInvitation({groupId : invi.groupId.toString(), profileId : invi.userId.toString()}).subscribe(
      res => {
        if(res.message) alert(res.message)
        if(res.error) alert(res.error)
        this.spliceInvitation(invi)
      }
    )
    }

    spliceInvitation(invi : userRequest){
      for(let i = 0; i < this.invitations.length; i++){
        if(this.invitations[i].userId === invi.userId &&
           this.invitations[i].groupId === invi.groupId){
            this.invitations.splice(i,1)
            this.navbarService.invi -= 1
            break
           }
      }
    }

    cancelRequest(invi : userRequest){
      this._groupService.cancelGroupRequest({groupId : invi.groupId.toString()}).subscribe(
        res => {
          if(res.message) alert(res.message)
          if(res.error) alert(res.error)
          this.navbarService.setGroupInvitations([{groupId : invi.groupId , groupName : invi.groupName}],false)
          this.navbarService.invi -=1
        }
      )
    }
    resetNotif(){
      this.notif = 0
      this._authService.resetUserNotif().subscribe(
        // res => this.notif = 0
      )
    }
    sortNotif(){
      this.notifications.sort((a, b) => b.notedAt.getTime() - a.notedAt.getTime())
    }
}
