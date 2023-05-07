import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NavbarService } from 'src/app/services/navbar/navbar.service';
import { GroupService } from 'src/app/services/group/group.service';
import { Group, User } from '@roomv1/shared';

interface userRequest {
  userId : any;
  userName : string;
  groupId : any;
  groupName : string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  adminGroups! : Group[]
  usersRequests : userRequest[] = []
  requests : number = 0
  notifications : string[] = []
  notif : number = 0
  constructor(public _auth : AuthService,
              private _router : Router,
              private navbarService: NavbarService,
              private groupService : GroupService) {}
              
  login(credential:NgForm){
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
        this.getAdminGroups(res.user)
        this._router.navigate(['/'])
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    ) 
  }             

  getAdminGroups(user : User){  
    this.groupService.listAdminGroups().subscribe(
      res => {
        this.addUserNotif(user)
        this.adminGroups = res.groups
        if(this.adminGroups.length !== 0){
          this.retrieveGroupsRequests(this.adminGroups)
          return
        }
        this.navbarService.notifications = this.notifications
        this.navbarService.notif = this.notif
      }, err => alert(err.message)
    )

  }

  retrieveGroupsRequests(groups : Group[]){
    this.usersRequests = []
    this.requests = 0
    for(let group of groups){
      if(group.usersIdDemandes!.length !== 0){
        for(let uId of group.usersIdDemandes!){
          this._auth.openUser(uId.toString()).subscribe(
            res=>{
              this.usersRequests.push({
                userId : res.user._id,
                userName : res.user.userName,
                groupId : group._id,
                groupName : group.groupName!
              })
            })
        }
        this.requests += group.uIdDs!
      }
      if(group.acceptedRequests!.length !== 0){
        for(let not of group.acceptedRequests!){
          this.notifications.push(not)
        }
        if(group.notif !== 0) this.notif += group.notif!
      }
    }
    this.navbarService.usersRequests = this.usersRequests
    this.navbarService.nRequests = this.requests
    this.navbarService.notifications = this.notifications
    this.navbarService.notif = this.notif
  }

  addUserNotif(user : User){
    this.notifications = []
    this.notif = 0
    if(user.acceptedRequests!.length !== 0){
      for(let not of user.acceptedRequests!){
          this.notifications.push(not)
      }
      if(user.notif !== 0) this.notif += user.notif!
    }
  }


}
