import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/services/home/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  Nposts: number = 0;
  Nusers: number = 0;
  Ngroups: number = 0;

  constructor(private _homeService : HomeService,
              private _router : Router){}

  ngOnInit(): void {
    this.getInfo()
  }

  getInfo(){
    this._homeService.getPosts()
    .subscribe(
      res=>this.Nposts = res.posts,
      err=>alert(err.message)
    )
    this._homeService.getUsers()
    .subscribe(
      res=>this.Nusers = res.users,
      err=>alert(err.message)
    )
    this._homeService.getGroups()
    .subscribe(
      res=>this.Ngroups = res.groups,
      err=>alert(err.message)
    )
  }            
}
