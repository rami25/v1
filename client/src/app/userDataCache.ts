import { Injectable } from "@angular/core";
import { NavbarService } from "./services/navbar/navbar.service";
import { Group, User } from "@roomv1/shared";
import { AuthService } from "./services/auth/auth.service";
import { GroupService } from "./services/group/group.service";

interface userRequest {
  userId? : any;
  userName? : string;
  groupId : any;
  groupName : string;
}

@Injectable()
export class UserDataCache {
  adminGroups! : Group[]
  usersRequests : userRequest[] = []
  groupRequests : userRequest[] = []
  requests : number = 0
  notifications : string[] = []
  notif : number = 0
  invitations : userRequest[] = []
  groupInvitations : userRequest[] = []
  invi : number = 0
    constructor(private navbarService: NavbarService,
                private _auth : AuthService,
                private groupService : GroupService){}
    userCache(user : User){
      this.navbarService.userName = user.userName
      this.navbarService.id = user._id!.toString()
      this.navbarService.email = user.email
      this.navbarService.desc = user.description!
      this.navbarService.psts = user.psts!
      this.navbarService.grps = user.grps!
      this.addUserNotif(user)
      this.addGroupRequests(user)
      this.addGroupInvitations(user)
      this.getAdminGroups(user)
      this.navbarService.notifications = this.notifications
      this.navbarService.notif = this.notif
    }


  getAdminGroups(user : User) {  
    this.groupService.listAdminGroups().subscribe(
      res => {
        this.adminGroups = res.groups
        if(this.adminGroups.length !== 0){
          this.retrieveGroupsRequests(this.adminGroups)
          this.retrieveGroupsInvitations(this.adminGroups)
        }
      }, err => alert(err.message)
    )
  }

  retrieveGroupsRequests(groups : Group[]){
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
    this.navbarService.nRequests += this.requests
  }
  retrieveGroupsInvitations(groups : Group[]){
    for(let group of groups){
      if(group.usersIdRequests!.length !== 0){
        for(let uId of group.usersIdRequests!){
          this._auth.openUser(uId.toString()).subscribe(
            res=>{
              this.invitations.push({
                userId : res.user._id,
                userName : res.user.userName,
                groupId : group._id,
                groupName : group.groupName!
              })
            })
        }
        this.invi += group.uIdRs!
      }
    }
    this.navbarService.invitations = this.invitations
    this.navbarService.invi += this.invi
  }



  addUserNotif(user : User){
    if(user.acceptedRequests!.length !== 0){
      for(let not of user.acceptedRequests!){
          this.notifications.push(not)
      }
      if(user.notif !== 0) this.notif += user.notif!
    }
  }

  addGroupRequests(user : User) {
    if(user.groupsIdDemandes!.length !== 0){
      for(let gId of user.groupsIdDemandes!){
          this.groupService.openGroup(gId.toString()).subscribe(
           res=>{
             this.groupRequests.push({
               userId : res.group.userAdmin,
               userName : res.group.admin,
               groupId : res.group._id,
               groupName : res.group.groupName
              })
          })       
      }
    }
    this.navbarService.groupRequests = this.groupRequests
    this.navbarService.nRequests += user.gIdDs!
  }

  addGroupInvitations(user : User) {
    if(user.groupsIdRequests!.length !== 0){
      for(let gId of user.groupsIdRequests!){
        this.groupService.openGroup(gId.toString()).subscribe(
          res => {
            this.groupInvitations.push({
              groupId : res.group._id,
              groupName : res.group.groupName
            })
          }
        )
      }
    this.navbarService.groupInvitations = this.groupInvitations
    this.navbarService.invi += user.gIdRs!
    }

  }
}