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
  listAdminGroups() : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/groups/get-group/all`)
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
  deleteGroup(groupData : {groupId : string}) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/groups/delete`, groupData)
  }
  updateGroup(groupData : {
    groupId : string;
    groupName : string;
    description : string;
  }) : Observable<any> {
    return this.http.patch<any>(`${this.apiServerUrl}/groups/update`, groupData)
  }
  //interact
    // admin
  inviteUserToGroup(groupData : {
    groupId : string,
    profileId : string
  }) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/groups/invite`, groupData)
  }
  removeUserInvitation(groupData : {
    groupId : string,
    profileId : string
  }) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/groups/remove-invitation`, groupData)
  }
  acceptUserRequest(groupData : {
    groupId : string,
    profileId : string
  }) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/groups/accept-request`, groupData)
  }
  deleteUserRequest(groupData : {
    groupId : string,
    profileId : string
  }) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/groups/reject-request`, groupData)
  }
    // user
  sendGroupRequest(groupData : {groupId : string}) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/groups/send-request`, groupData)
  }
  cancelGroupRequest(groupData : {groupId : string}) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/groups/delete-request`, groupData)
  }
  acceptGroupRequest(groupData : {groupId : string}) : Observable<any>{
    return this.http.post<any>(`${this.apiServerUrl}/groups/join`, groupData)
  }
  deleteGroupRequest(groupData : {groupId : string}) : Observable<any>{
    return this.http.post<any>(`${this.apiServerUrl}/groups/reject-invitation`, groupData)
  }
  leaveGroup(groupData : {groupId : string}) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/groups/leave-group`, groupData)
  }
}
