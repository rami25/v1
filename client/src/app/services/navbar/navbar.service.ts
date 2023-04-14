import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private _id = new BehaviorSubject<string>('');
  private _userName = new BehaviorSubject<string>('');
  private _email = new BehaviorSubject<string>('');
  private _description = new BehaviorSubject<string>('');

  _id$ = this._id.asObservable();
  _userName$ = this._userName.asObservable();
  _email$ = this._email.asObservable();
  _description$ = this._description.asObservable();
  
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
}
