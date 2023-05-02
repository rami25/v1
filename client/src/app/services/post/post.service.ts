import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiServerUrl = environment.apiBaseUrl

  constructor(private http : HttpClient) { }
  listPublicPosts() : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/list-posts`);
  }
  listGroupPosts(groupId : string) : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/list-posts/none/${groupId}`);
  }
  getUserPosts(profileId: string) : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/list-posts/${profileId}`);
  }
  getP() : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/posts/list-up`);
  }
  getOnePost(id : string) : Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/post/${id}`);
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
  updatePost(postData : {
    postId : string;
    title : string;
    description : string;
    urls?: string[];
    files? : string[];
    privacy : string;
  }) : Observable<any> {
    console.log(postData)
    return this.http.patch<any>(`${this.apiServerUrl}/posts/update`, postData)
  }

  deleteUserPost(postData : { postId : string}) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/posts/delete`, postData)
  }
  listStars(postData : {postId : string}) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/list-postLikes`, postData)
  }
  addStar(postData : {postId : string}): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/likes/post/add`, postData)
  }
  checkStar(postData : {postId : string}) : Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/likes/post/check`, postData)
  }
  removeStar(postData : {postId : string}): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/likes/post/remove`, postData)
  }
  ////////// Comment
  countComments(commentData : {
    postId : string,
  }): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/count-comments`, commentData)
  }
  listComments(commentData : {
    postId : string,
  }): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/list-comments`, commentData)
  }
  addComment(commentData : {
    postId : string,
    content : string
  }): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/comments/create`, commentData)
  }
  deleteComment(commentData : {
    postId : string,
    commentId : string
  }): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/comments/delete`, commentData)
  }
  updateComment(commentData : {
    commentId : string,
    content : string
  }): Observable<any> {
    return this.http.patch<any>(`${this.apiServerUrl}/comments/update`, commentData)
  }


}
