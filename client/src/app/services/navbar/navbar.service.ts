import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface userRequest {
  userId : any;
  userName : string;
  groupId : any;
  groupName : string;
}

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private _id = new BehaviorSubject<string>('');
  private _userName = new BehaviorSubject<string>('');
  private _email = new BehaviorSubject<string>('');
  private _description = new BehaviorSubject<string>('');
  private _psts = new BehaviorSubject<number>(0);
  private _grps = new BehaviorSubject<number>(0);
  //notifications
  private _notif = new BehaviorSubject<number>(0);
  private _notifications = new BehaviorSubject<string[]>([]);
  //userRequests
  private _usersRequests = new BehaviorSubject<userRequest[]>([]);
  private _nRequests = new BehaviorSubject<number>(0);
  //invitations
  private _invitations = new BehaviorSubject<userRequest[]>([]);
  private _invi = new BehaviorSubject<number>(0);

  _id$ = this._id.asObservable();
  _userName$ = this._userName.asObservable();
  _email$ = this._email.asObservable();
  _description$ = this._description.asObservable();
  _psts$ = this._psts.asObservable();
  _grps$ = this._grps.asObservable();
  //notifications
  _notif$ = this._notif.asObservable();
  _notifications$ = this._notifications.asObservable();
  ///userRequests
  _usersRequests$ = this._usersRequests.asObservable();
  _nRequests$ = this._nRequests.asObservable();
  ///invitations
  _invitations$ = this._invitations.asObservable();
  _invi$ = this._invi.asObservable();
  
  ////////////////////////// userId
  set id(id: string) {
    this._id.next(id)
  }

  get id(): string {
    return this._id.value;
  }

  //////////////////////// userName
  set userName(userName: string) {
    this._userName.next(userName);
  }

  get userName(): string {
    return this._userName.value;
  }

  ///////////////////////////// user Email
  set email(email: string) {
    this._email.next(email);
  }

  get email(): string {
    return this._email.value;
  }
  ////////////////////////////////////// user Description
  set desc(desc: string) {
    this._description.next(desc);
  }

  get desc(): string {
    return this._description.value;
  }
  //////////////////////////// Psts
  set psts(psts: number) {
    this._psts.next(psts);
  }
  get psts(): number {
    return this._psts.value;
  }
  //////////////////////////// Grps
  set grps(grps: number) {
    this._grps.next(grps);
  }

  get grps(): number {
    return this._grps.value;
  }
  ///////////////////////////////////////// Notifications
  set notif(notif: number) {
    this._notif.next(notif);
  }

  get notif(): number {
    return this._notif.value;
  }
  set notifications(notifications: string[]) {
    this._notifications.next(notifications);
  }

  get notifictions(): string[] {
    return this._notifications.value;
  }


  ///////////////////////////////////////////////////// User Requests
  set nRequests(n: number) {
    this._nRequests.next(n);
  }

  get nRequests(): number {
    return this._nRequests.value;
  }
  set usersRequests(usersRequests: userRequest[]) {
    this._usersRequests.next(usersRequests);
  }

  get usersRequests(): userRequest[] {
    return this._usersRequests.value;
  }
  ///////////////////////////////////////////////////// group invitations
  set invi(n: number) {
    this._invi.next(n);
  }

  get invi(): number {
    return this._invi.value;
  }
  setInvitations(array: userRequest[], add : boolean) {
    const currentArray = this._invitations.getValue()
    if(add){
      for(let element of array){
        currentArray.push(element)
      }
      this._invitations.next(currentArray)
      return
    }
    const element = array[0]
    for(let i = 0; i < currentArray.length; i++){
      if(currentArray[i].userId === element.userId &&
         currentArray[i].groupId === element.groupId)
         currentArray.splice(i,1)
    }
    this._invitations.next(currentArray);
  }
  set invitations( array : userRequest[])  {
    this._invitations.next(array);
  }

  get inviations(): userRequest[] {
    return this._invitations.value;
  }

}
