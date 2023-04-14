import { Injectable } from '@angular/core';
import { NavbarService } from '../navbar/navbar.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private userName: any;

  constructor(private _nav : NavbarService) {
  }

  ngOnInit(){
    this._nav._userName$.subscribe(name => {
      localStorage.setItem('userName', JSON.stringify(name))
      this.userName = name;
    });
  }

  setData(userName: any) {
    localStorage.setItem('userName', JSON.stringify(userName))
    this.userName = userName;
  }

  getData() {
    const name = localStorage.getItem('userName')
    if(name)
      this.userName = JSON.parse(name)
    return this.userName;
  }
}
