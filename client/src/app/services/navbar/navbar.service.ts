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
  private _psts = new BehaviorSubject<number>(0);
  private _grps = new BehaviorSubject<number>(0);

  _id$ = this._id.asObservable();
  _userName$ = this._userName.asObservable();
  _email$ = this._email.asObservable();
  _description$ = this._description.asObservable();
  _psts$ = this._psts.asObservable();
  _grps$ = this._grps.asObservable();
  
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
}
