import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
// import { User } from '@roomv1/shared';
 const headers = new HttpHeaders().set('Content-Type', 'application/json');
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3000/api/v1/visitors/sign-in'
  constructor(private http : HttpClient,
              private _router : Router) { }


  loginUser(credential: {login : string, password : string}) : Observable<any> {
    return this.http.post<any>(this.url , credential , { headers })
  }
}
