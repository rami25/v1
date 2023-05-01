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

  listGroups() : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/list-groups`)
  }
  openGroup(groupId : string) : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/group/${groupId}`)
  }
  getUserGroups() : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/groups/list-shared-groups`)
  }
  openUserGroups(userId : string) : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/list-user-groups/${userId}`)
  }
  createGroup(groupData : {
    groupName : string;
    description : string;
  }) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/groups/create`, groupData)
  }
}
