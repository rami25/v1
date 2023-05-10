import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NavbarService } from '../navbar/navbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiServerUrl = environment.apiBaseUrl
  constructor(private http : HttpClient,
              private _router : Router,
              private navbarService : NavbarService) { }
  
  listUsers() : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/list-users`)
  }
  listGroupUsers(groupId : string) : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/list-group-users/${groupId}`)
  }
  getUserById() : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/users/get-by-id`)
  }
  openUser(userId : string) : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/${userId}`)
  }
  loginUser(credential: {login : string, password : string}) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/visitors/sign-in` , credential )
  }
  resetUserNotif() : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/users/reset-notif`)
  }
  signupUser(userData : {
    userName : string,
    email : string,
    password : string,
    description?: string
  }) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/visitors/sign-up` , userData)
  }

  logoutUser() {
    this.navbarService.notifications = []
    this.navbarService.notif = 0
    this.navbarService.usersRequests = []
    this.navbarService.nRequests = 0
    this.navbarService.groupRequests = []
    this.navbarService.invitations = []
    this.navbarService.invi = 0
    localStorage.removeItem('token')
    // this._router.navigate(['/home'])
  }

  loggedIn(){//?
    return !!localStorage.getItem('token')
  }

  getToken(){
    return localStorage.getItem('token')
  }

  updateUser(userData : {
    userName? : string,
    email? : string,
    description?: string;
  }) {
    return this.http.patch<any>(`${this.apiServerUrl}/users/update-user` , userData)
  }

  deleteAccount(data : { password : string }) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/users/delete-user` , data)
  }

}
