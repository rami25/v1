import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiServerUrl = environment.apiBaseUrl

  constructor(private http : HttpClient,
              private _router : Router) { }
              
  getPosts(): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/count-posts`)
  }
  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/count-users`)
  }
  getGroups(): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/count-groups`)
  }
}
