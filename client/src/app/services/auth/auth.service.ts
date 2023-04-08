import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { User } from '@roomv1/shared';
 const headers = new HttpHeaders().set('Content-Type', 'application/json');
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiServerUrl = environment.apiBaseUrl
  constructor(private http : HttpClient,
              private _router : Router) { }


  loginUser(credential: {login : string, password : string}) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/visitors/sign-in` , credential )
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
    localStorage.removeItem('token')
    this._router.navigate(['/log-in'])
  }

  loggedIn(){//?
    return !!localStorage.getItem('token')
  }

  getToken(){
    return localStorage.getItem('token')
  }
}
