import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '@roomv1/shared';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiServerUrl = environment.apiBaseUrl

  constructor(private http : HttpClient) { }

  getUserPosts(profileId: string) : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/list-posts/${profileId}`);
  }
  getP() : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/posts/list-up`);
  }

  createPost(postData : {
    title : string;
    description : string;
    urls?: string[];
    files? : string[];
    groupId? : string;
    privacy : string;
  }) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/posts/create`, postData)
  }

  deleteUserPost(postData : { postId : string}) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/posts/delete`, postData)
  }
}
