import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private apiServerUrl = environment.apiBaseUrl
  constructor(private http : HttpClient) { }

  getUserGroups() : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/groups/list-shared-groups`)
  }
  createGroup(groupData : {
    groupName : string;
    description : string;
  }) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/groups/create`, groupData)
  }
}
