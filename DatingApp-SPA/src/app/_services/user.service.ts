import { User } from './../_model/user';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getUsers():Observable<User[]>{
    return this.http.get<User[]>(this.baseUrl + 'users/');
  }

  getUser(id):Observable<User>{
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }
}