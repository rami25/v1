import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private _id = new BehaviorSubject<string>('');
  private _userName = new BehaviorSubject<string>('');

  _id$ = this._id.asObservable();
  _userName$ = this._userName.asObservable();

  set id(id: string) {
    this._id.next(id);
  }

  get id(): string {
    return this._id.value;
  }

  set userName(userName: string) {
    this._userName.next(userName);
  }

  get userName(): string {
    return this._userName.value;
  }
}
